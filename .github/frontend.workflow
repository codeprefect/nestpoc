workflow "Frontend: Test - Build - Publish" {
  on = "push"
  resolves = [
    "Publish Image",
  ]
}

action "Docker Login" {
  uses = "actions/docker/login@8cdf801b322af5f369e00d85e9cf3a7122f49108"
  secrets = ["DOCKER_REGISTRY_URL", "DOCKER_USERNAME", "DOCKER_PASSWORD"]
}

action "Build Image" {
  uses = "actions/docker/cli@8cdf801b322af5f369e00d85e9cf3a7122f49108"
  needs = ["Docker Login", "Unit Tests"]
  secrets = ["DOCKER_REGISTRY_URL", "DOCKER_USERNAME", "REPO_NAME", "FRONTEND_IMAGE"]
  args = "build -t $DOCKER_REGISTRY_URL/$DOCKER_USERNAME/$REPO_NAME/$FRONTEND_IMAGE:latest ./$FRONTEND_IMAGE"
}

action "Publish Image" {
  uses = "actions/docker/cli@8cdf801b322af5f369e00d85e9cf3a7122f49108"
  needs = ["Build Image"]
  secrets = ["DOCKER_REGISTRY_URL", "DOCKER_USERNAME", "REPO_NAME", "FRONTEND_IMAGE"]
  args = "push $DOCKER_REGISTRY_URL/$DOCKER_USERNAME/$REPO_NAME/$FRONTEND_IMAGE"
}

action "Install Yarn" {
  uses = "actions/npm@master"
  args = "install yarn -g"
}

action "Install Deps" {
  uses = "actions/npm@master"
  needs = ["Install Yarn"]
  runs = ".github/scripts/install_deps.sh ./nestpoc_ui"
}

action "Unit Tests" {
  uses = "actions/npm@master"
  needs = ["Install Deps"]
  runs = ".github/scripts/run_commands.sh"
  args = ["cd nestpoc_ui && yarn test --coverage"]
}
