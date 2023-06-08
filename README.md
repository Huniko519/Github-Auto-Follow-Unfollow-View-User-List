# Auto Follow && Unfollower by Github Actions for Github users

A feature that unfollows all non-followers of the owner and a feature that follows back those who were not being followed by the owner.
GitHub Action automatically creates or updates Readme with users(unfollowers, unfollowing, followers, followings) list and current user information.

## Usage

The purpose of this program is to generate an updated README file for any user's repository, displaying details about their account's followers, following, unfollowers and unfollowing and current users's info. 

The program also implements two functions to perform actions on the GitHub API: a feature that unfollows all non-followers of the owner and a feature that follows back those who were not being followed by the owner.

## Example

```yaml
name: Github-Auto-Follow-Unfollow-View-User-List

on:
  workflow_dispatch:
  schedule:
    - cron: '0 */3 * * *'

jobs:
  auto-update:
    runs-on: ubuntu-latest
    steps:
      - name: Github-Auto-Follow-Unfollow-View-User-List
        uses: Huniko519/Github-Auto-Follow-Unfollow-View-User-List@main
        with:
          token: ${{ secrets.TOKEN }}
          username: ${{ github.actor }}
          repository: ${{ github.repository }}
```

## Inputs

| inputs                   | required | default               | description |
|--------------------------|----------|-----------------------|-------------|
| `token`           	     | true     | `${{ github.token }}` | The token used to authenticate. |
| `username`               | true     | `${{ github.actor }}` | The base user name. |
| `repository`             | true     | `${{ github.repository }}` | The name of the repository. |

## Input of this action

- input:
  - `token`: [GitHub personal access token](https://github.com/settings/tokens/new) with at least **'read:user' and 'repo'** scope. _⚠️ You should store this token as [secret](#secrets)._ This input is required.
  - `username`: This is username of github. This input is required.
  - `repository`: This is name of installed repository. This input is required.
