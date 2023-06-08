const { Octokit } = require("@octokit/rest");
const { writeFileSync } = require("fs");
const github = require("@actions/github");
const core = require("@actions/core");

async function run() {
  try {
    const token = core.getInput('token');
    const username = core.getInput('username');
    const repository = core.getInput('repository');
    const octokit = new Octokit({ auth: `token ${token}` });

    async function queryFollowers(page = 1) {
      let { data: followers } = await octokit.users.listFollowersForUser({
        username,
        per_page: 100,
        page,
      });
      if (followers.length >= 100) {
        followers = followers.concat(await queryFollowers(page + 1));
      }
      return followers;
    }

    async function queryFollowing(page = 1) {
      let { data: following } = await octokit.users.listFollowingForUser({
        username,
        per_page: 100,
        page,
      });
      if (following.length >= 100) {
        following = following.concat(await queryFollowing(page + 1));
      }
      return following;
    }

    async function queryUnfollowUnfollowers(unfollowers) {
      const unfollower = unfollowers.next();
      if( !unfollower.done ) {
        await octokit.users.unfollow({
          username: unfollower.value[1].login,
        });
        await queryUnfollowUnfollowers(unfollowers);
      }
      return true;
    }

    async function queryFollowingUnfollowingUsers(unfollowing, index = 0) {
      const follower = unfollowing.next();
      if( !follower.done ) {
        await octokit.users.follow({
          username: follower.value[1].login,
        });
        await queryFollowingUnfollowingUsers(unfollowing);
      }
      return true;
    }

    const { data: user } = await octokit.users.getByUsername({
      username,
    });

    const followers = await queryFollowers();
    followers.reverse();
    const following = await queryFollowing();
    const unfollowers = following.filter(e => !followers.map((item) => item.login).includes(e.login));
    const unfollowing = followers.filter(e => !following.map((item) => item.login).includes(e.login));

    if(unfollowers.length  > 0) {
      await queryUnfollowUnfollowers(unfollowers.entries());
      console.log(`You unfollowed the ${unfollowers.length} bad guy${unfollowers.length > 1 ? 's' : ''}.`);
    };
    if(unfollowing.length  > 0){
      await queryFollowingUnfollowingUsers(unfollowing.entries());
      console.log(`You followed the ${unfollowing.length} good guy${unfollowing.length > 1 ? 's' : ''}.`);
    } 

    const before = `# 🐬 Easy view and filter all unfollowers, unfollowing, follows and following. Auto update by GitHub Action.

- Since GitHub's default follows and following does not support paging and filtering

`;

    function dealBlog(blog) {
      if (blog) {
        return `[${blog}](https://${blog})`;
      }
      return "-";
    }

    const middle = `## ${username}

<img src="${user.avatar_url}" width="150" />

| Name | Bio | Blog | Location | Company |
| -- | -- | -- | -- | -- |
| ${user.name || "-"} | ${user.bio || "-"} | ${dealBlog(user.blog)} | ${
      user.location || "-"
    } | ${getCompany(user.company)} |

## Unfollowers <kbd>${unfollowers.length}</kbd>
#### Are not following you back

<table width="100%">
  ${formatTable(unfollowers)}
</table>

## Unfollowing <kbd>${unfollowing.length}</kbd>
#### You are not following back

<table width="100%">
  ${formatTable(unfollowing)}
</table>

## Followers <kbd>${followers.length}</kbd>
#### Are following you

<table width="100%">
  ${formatTable(followers)}
</table>

## Following <kbd>${following.length}</kbd>
#### You are following

<table width="100%">
  ${formatTable(following)}
</table>
    
`;

    const end = `## LICENSE
Copyright (c) 2023-present [Huniko519](https://github.com/Huniko519)
`;
    writeFileSync(`https://github.com/${repository}/README.md`, before + middle + end);
    console.log("Done!");
  } catch (error) {
    console.log(error.message);
  }
}

function formatTable(arr) {
  if (arr.length === 0) {
    return "";
  }
  let result = "";
  let row = arr.length / 10;
  const lastNo = arr.length % 10;
  if (lastNo != 0) row += 1;
  for (let j = 1; j <= row; j += 1) {
    let data = "";
    data = `<tr width="100%">
    <td width="10%" align="center">${getUser(arr[(j - 1) * 10])}
    </td>
    <td width="10%" align="center">${getUser(arr[(j - 1) * 10 + 1])}
    </td>
    <td width="10%" align="center">${getUser(arr[(j - 1) * 10 + 2])}
    </td>
    <td width="10%" align="center">${getUser(arr[(j - 1) * 10 + 3])}
    </td>
    <td width="10%" align="center">${getUser(arr[(j - 1) * 10 + 4])}
    </td>
    <td width="10%" align="center">${getUser(arr[(j - 1) * 10 + 5])}
    </td>
    <td width="10%" align="center">${getUser(arr[(j - 1) * 10 + 6])}
    </td>
    <td width="10%" align="center">${getUser(arr[(j - 1) * 10 + 7])}
    </td>
    <td width="10%" align="center">${getUser(arr[(j - 1) * 10 + 8])}
    </td>
    <td width="10%" align="center">${getUser(arr[(j - 1) * 10 + 9])}
    </td>
  </tr>`;
    result += data;
  }
  return result;
}

function getUser(user) {
  return user
    ? `
      <a href="${user.html_url}">
        <img src="${user.avatar_url}" />
      </a>`
    : "";
}

function getCompany(c) {
  if (c) {
    c = c.replace("@", "");
    return `[@${c}](https://github.com/${c})`;
  }
  return `-`;
}

run();
