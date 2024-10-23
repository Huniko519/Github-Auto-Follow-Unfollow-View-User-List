const { Octokit } = require("@octokit/rest");
const core = require("@actions/core");

async function run() {
  try {
    const token = core.getInput('token');
    const repository = core.getInput('repository');
    const isReadmeUpdate = core.getInput('isReadmeUpdate') === 'true';
    const safeUserList = core.getInput('safeUserList').split(",");

    const [username, reponame] = repository.split("/");
    const octokit = new Octokit({ auth: `token ${token}` });

    const followers = await fetchAllPages(octokit.users.listFollowersForUser, { username });
    const following = await fetchAllPages(octokit.users.listFollowingForUser, { username });

    const unfollowers = following.filter(user => !followers.some(follower => follower.login === user.login));
    const unfollowing = followers.filter(user => !following.some(follow => follow.login === user.login));

    if (unfollowers.length > 0) {
      await processUsers(unfollowers, octokit.users.unfollow, safeUserList);
      console.log(`You unfollowed ${unfollowers.length} user(s).`);
    }

    if (unfollowing.length > 0) {
      await processUsers(unfollowing, octokit.users.follow);
      console.log(`You followed ${unfollowing.length} user(s).`);
    }

    if (isReadmeUpdate && (unfollowers.length > 0 || unfollowing.length > 0)) {
      await updateReadme(octokit, username, reponame, followers);
    }

    console.log("Done!");
  } catch (error) {
    console.log(error.message);
  }
}

async function fetchAllPages(apiMethod, params, page = 1, results = []) {
  const { data } = await apiMethod({ ...params, per_page: 100, page });
  results.push(...data);
  return data.length === 100 ? fetchAllPages(apiMethod, params, page + 1, results) : results;
}

async function processUsers(users, apiMethod, safeUserList = []) {
  for (const user of users) {
    if (!safeUserList.includes(user.login)) {
      await apiMethod({ username: user.login });
    }
  }
}

async function updateReadme(octokit, username, reponame, followers) {
  const { data: user } = await octokit.users.getByUsername({ username });
  const content = generateReadmeContent(user, followers);
  const { status, message: sha } = await checkFileExistence(octokit, username, reponame);

  const requestData = {
    owner: username,
    repo: reponame,
    path: "README.md",
    message: "Updated: Readme.md With New Infos By Github Action",
    content: Buffer.from(content).toString('base64'),
    committer: { name: username, email: `${username}@users.noreply.github.com` },
    author: { name: username, email: `${username}@users.noreply.github.com` },
    ...(status && { sha })
  };

  await octokit.repos.createOrUpdateFileContents(requestData);
}

async function checkFileExistence(octokit, owner, repo) {
  try {
    const { data: { sha } } = await octokit.repos.getReadme({ owner, repo });
    return { status: true, message: sha };
  } catch (error) {
    return { status: false, message: error.status === 404 ? "File does not exist." : error.message };
  }
}

function generateReadmeContent(user, followers) {
  return `## ${user.login}
<img src="${user.avatar_url}" width="150" />

| Name | Bio | Blog | Location | Company |
| -- | -- | -- | -- | -- |
| ${user.name || "-"} | ${user.bio || "-"} | ${formatBlog(user.blog)} | ${user.location || "-"} | ${formatCompany(user.company)} |

## Followers <kbd>${followers.length}</kbd>

<table width="100%">
  ${formatTable(followers)}
</table>

## LICENSE
Copyright (c) 2023-present [${user.login}](https://github.com/${user.login})
`;
}

function formatBlog(blog) {
  return blog ? `[${blog}](https://${blog})` : "-";
}

function formatCompany(company) {
  return company ? `[@${company.replace("@", "")}](https://github.com/${company.replace("@", "")})` : "-";
}

function formatTable(users) {
  return users.reduce((acc, user, index) => {
    if (index % 10 === 0) acc += "<tr width='100%'>";
    acc += `<td width='10%' align='center'><a href='${user.html_url}'><img src='${user.avatar_url}' /></a></td>`;
    if (index % 10 === 9) acc += "</tr>";
    return acc;
  }, "");
}

run();
