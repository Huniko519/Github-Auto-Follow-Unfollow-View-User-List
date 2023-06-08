# Github-Auto-Follow-Unfollow-View-User-List

GitHub Action automatically creates or updates Readme with an overview.

## Usage

💡 Auto follow, unfollow, update user list(unfollow, unfollowing, follower, following) by Cron JOB ( every 8 hours )

## Inputs

| inputs                   | required | default               | description |
|--------------------------|----------|-----------------------|-------------|
| `token`           	     | true     | `${{ github.token }}` | The token used to authenticate. |
| `username`               | true     | `${{ github.actor }}` | The base user name. |
| `repository`             | true     | `${{ github.repository }}` | The name of the repository. |

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
