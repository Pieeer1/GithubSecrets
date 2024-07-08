# GithubSecrets
Manage Github Secrets Through Github Actions

## Usage

```yml
     - name: Set Github Secret
        uses: Pieeer1/GithubSecrets@1.0.0
        with:
          token: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
          name: 'TEST_SECRET'
          value: 'some secret value'
          repository: 'your-repository-name-here'
          owner: 'your-repository-owner-here'
```

## Personal Access Token Setup

1. Navigate to your github profile
2. Navigate to Settings
3. Create a new fine grained personal access token
4. Give the permissions to the relevant repositories, as well as the ability for the following:
- Secrets Read
- Secrets Write
5. Paste the token as the PERSONAL_ACCESS_TOKEN in your actions secrets
6. The Pipeline should operate as expected.

