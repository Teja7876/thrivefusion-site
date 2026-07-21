"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerGitHubDeployment = void 0;
const functions = require("firebase-functions");
const params_1 = require("firebase-functions/params");
// Define the secrets to be injected from Google Cloud Secret Manager
const githubPat = (0, params_1.defineSecret)("GITHUB_PAT");
const githubOwner = (0, params_1.defineSecret)("GITHUB_OWNER");
const githubRepo = (0, params_1.defineSecret)("GITHUB_REPO");
exports.triggerGitHubDeployment = functions
    .runWith({ secrets: [githubPat, githubOwner, githubRepo] })
    .firestore.document("posts/{postId}")
    .onWrite(async (change, context) => {
    // We want to trigger when a post is created, updated, or deleted
    // The secrets are injected into the environment at runtime
    const pat = githubPat.value();
    const owner = githubOwner.value();
    const repo = githubRepo.value();
    if (!pat || !owner || !repo) {
        console.error("Missing GitHub secrets. Deployment aborted.");
        return null;
    }
    try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/dispatches`, {
            method: "POST",
            headers: {
                "Accept": "application/vnd.github.v3+json",
                "Authorization": `token ${pat}`,
                "Content-Type": "application/json",
                "User-Agent": "Firebase-Cloud-Function"
            },
            body: JSON.stringify({
                event_type: "publish_blog"
            })
        });
        if (!response.ok) {
            console.error(`GitHub API error: ${response.statusText}`);
        }
        else {
            console.log("GitHub deployment triggered successfully!");
        }
    }
    catch (error) {
        console.error("Error triggering deployment:", error);
    }
    return null;
});
//# sourceMappingURL=index.js.map