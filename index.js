const core = require('@actions/core');
const sodium = require('libsodium-wrappers');
const octokit = require('@octokit/core');

const bootstrap = async () => {
    const owner = core.getInput('owner');
    const repo = core.getInput('repository');
    const secretName = core.getInput('name');
    const secret = core.getInput('value');
    const visibility = core.getInput('visibility');
    const token = core.getInput('token');

    if(secretName.startsWith('GITHUB_')){
        core.setFailed('Invalid secret name, cannot start with GITHUB_' );
        return;
    }

    await sodium.ready;

    const key = sodium.crypto_secretbox_keygen();
    const binsec = sodium.from_string(secret);

    const encBytes = sodium.crypto_box_seal(binsec, key);

    const encryptedValue = sodium.to_base64(encBytes, sodium.base64_variants.ORIGINAL);

    console.log(encryptedValue);
    console.log(key)

    const octo = new octokit.Octokit({auth: token});

    const response = await octo.request(`PUT /repos/${owner}/${repo}/actions/secrets/${secretName}`, {
        owner: owner,
        repo: repo,
        encrypted_value: encryptedValue,
        key_id: key,
        visibility: visibility,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    });
    
    if(response.status > 299) {
        core.setFailed(`Failed to set secret: ${response.error}`);
    }
    else {
        core.setOutput('Success');
    }
};

try {
    bootstrap();
}
catch (error) {
    core.setFailed(error.message);
}