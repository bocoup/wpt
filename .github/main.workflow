workflow "Build & Publish Documentation Website" {
  on = "push"
  resolves = ["website-build-and-publish"]
}

action "website-build-and-publish" {
  uses = "./tools/docker/documentation"
  runs = ["/bin/bash", "tools/ci/website_build.sh"]
  secrets = ["DEPLOY_TOKEN"]
}
