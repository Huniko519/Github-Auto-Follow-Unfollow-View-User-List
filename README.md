# Auto Follows & Unfollows by GitHub Actions for GitHub users

A feature that unfollows all non-followers of the owner and a feature that follows back those who were not being followed by the owner.
GitHub Action automatically creates or updates README with information of owner and followers.

## Usage

The purpose of this program is to generate an updated README file for any user's repository, displaying details about their account's followers and current user's info. 
The program also implements two functions to perform actions on the GitHub API: a feature that unfollows all non-followers of the owner and a feature that follows back those who were not being followed by the owner.

## Example

```yaml
name: Github-Auto-Follow-Unfollow-View-User-List

on:
  workflow_dispatch:
  schedule:
    - cron: '0 */8 * * 1-5'

jobs:
  auto-update:
    runs-on: ubuntu-latest
    steps:
      - name: Github-Auto-Follow-Unfollow-View-User-List
        uses: Huniko519/Github-Auto-Follow-Unfollow-View-User-List@main
        with:
          token: ${{ secrets.TOKEN }}
          repository: ${{ github.repository }}
          isReadmeUpdate: true
          isEnableFollow: true
          isEnableUnfollow: true
          safeUserList: 'Babi1205,Huniko-Team'
```
[Example Link](https://github.com/Huniko519/Auto-Follows-Unfollows-by-Github-Actions-for-Github-users)

## Inputs

| inputs                   | required | default               | description |
|--------------------------|----------|-----------------------|-------------|
| `token`           	   | true     | `${{ github.token }}` | The token used to authenticate. |
| `repository`             | true     | `${{ github.repository }}` | The name of the repository. |
| `isReadmeUpdate`         | false    | `${{ github.isReadmeUpdate }}` | Readme update feature enable status. |
| `isEnableFollow`         | false    | `${{ github.isEnableFollow }}` | Follow feature enable status. |
| `isEnableUnfollow`       | false    | `${{ github.isEnableUnfollow }}` | Unfollow feature enable status. |
| `safeUserList`           | false    | `${{ github.safeUserList }}` | Lists of Safe Users. |

## Input of this action

- input:
  - `token`: [GitHub personal access token](https://github.com/settings/tokens/new) with at least **'read:user' and 'repo'** scope. _⚠️ You should store this token as [secret](#secrets)._ This input is required.
  - `repository`: This is the name of installed repository. This input is required.

## Contributors

<!-- markdownlint-disable -->
|  [![Huniko519][huniko519_avatar]][huniko519_homepage]<br/>[Huniko519][huniko519_homepage] |  [![B.B][bibi1205_avatar]][bibi1205_homepage]<br/>[B.B][bibi1205_homepage] |
| --- | --- |
<!-- markdownlint-restore -->

  [huniko519_homepage]: https://github.com/Huniko519
  [huniko519_avatar]: https://img.cloudposse.com/135x135/https://github.com/Huniko519.png
  [bibi1205_homepage]: https://github.com/Bibi1205
  [bibi1205_avatar]: https://img.cloudposse.com/135x135/https://github.com/Bibi1205.png

## LICENSE
Copyright (c) 2023-present [Huniko519](https://github.com/Huniko519)
