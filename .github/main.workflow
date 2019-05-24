# Backend workflow
workflow "Backend: Test - Build - Publish" {
  on = "push"
  resolves = [
    "BE - Publish Image",
  ]
}

action "BE - Docker Login" {
  uses = "actions/docker/login@8cdf801b322af5f369e00d85e9cf3a7122f49108"
  secrets = ["DOCKER_REGISTRY_URL", "DOCKER_USERNAME", "DOCKER_PASSWORD"]
}

action "BE - Build Image" {
  uses = "actions/docker/cli@8cdf801b322af5f369e00d85e9cf3a7122f49108"
  needs = ["BE - Docker Login", "BE - Unit Tests"]
  secrets = ["DOCKER_REGISTRY_URL", "DOCKER_USERNAME", "REPO_NAME", "BACKEND_IMAGE"]
  args = "build -t $DOCKER_REGISTRY_URL/$DOCKER_USERNAME/$REPO_NAME/$BACKEND_IMAGE:latest ./$BACKEND_IMAGE"
}

action "BE - Publish Image" {
  uses = "actions/docker/cli@8cdf801b322af5f369e00d85e9cf3a7122f49108"
  needs = ["BE - Build Image"]
  secrets = ["DOCKER_REGISTRY_URL", "DOCKER_USERNAME", "REPO_NAME", "BACKEND_IMAGE"]
  args = "push $DOCKER_REGISTRY_URL/$DOCKER_USERNAME/$REPO_NAME/$BACKEND_IMAGE"
}

action "BE - Install Yarn" {
  uses = "actions/npm@master"
  args = "install yarn -g"
}

action "BE - Install Deps" {
  needs = ["BE - Install Yarn"]
  uses = "actions/npm@master"
  runs = ".github/scripts/install_deps.sh nestpoc_api"
}

action "BE - Create ormconfig" {
  uses = "jcblw/bash@master"
  needs = ["BE - Install Deps"]
  args = ["cd nestpoc_api && echo $ORM_CONFIG | base64 --decode > ./ormconfig.json"]
  secrets = ["ORM_CONFIG"]
}

action "BE - Run Migrations" {
  needs = ["BE - Create ormconfig"]
  uses = "actions/npm@master"
  runs = ".github/scripts/db_migrate.sh"
}

action "BE - Unit Tests" {
  needs = ["BE - Run Migrations"]
  uses = "actions/npm@master"
  runs = ".github/scripts/run_commands.sh"
  args = ["cd nestpoc_api && yarn test:unit --coverage"]
}

# Front-end workflow
workflow "Frontend: Test - Build - Publish" {
  on = "push"
  resolves = [
    "FE - Publish Image",
  ]
}

action"FE - Docker Login" {
  uses = "actions/docker/login@8cdf801b322af5f369e00d85e9cf3a7122f49108"
  secrets = ["DOCKER_REGISTRY_URL", "DOCKER_USERNAME", "DOCKER_PASSWORD"]
}

action"FE - Build Image" {
  uses = "actions/docker/cli@8cdf801b322af5f369e00d85e9cf3a7122f49108"
  needs = ["FE - Docker Login", "FE - Unit Tests"]
  secrets = ["DOCKER_REGISTRY_URL", "DOCKER_USERNAME", "REPO_NAME", "FRONTEND_IMAGE"]
  args = "build -t $DOCKER_REGISTRY_URL/$DOCKER_USERNAME/$REPO_NAME/$FRONTEND_IMAGE:latest ./$FRONTEND_IMAGE"
}

action"FE - Publish Image" {
  uses = "actions/docker/cli@8cdf801b322af5f369e00d85e9cf3a7122f49108"
  needs = ["FE - Build Image"]
  secrets = ["DOCKER_REGISTRY_URL", "DOCKER_USERNAME", "REPO_NAME", "FRONTEND_IMAGE"]
  args = "push $DOCKER_REGISTRY_URL/$DOCKER_USERNAME/$REPO_NAME/$FRONTEND_IMAGE"
}

action"FE - Install Yarn" {
  uses = "actions/npm@master"
  args = "install yarn -g"
}

action"FE - Install Deps" {
  uses = "actions/npm@master"
  needs = ["FE - Install Yarn"]
  runs = ".github/scripts/install_deps.sh ./nestpoc_ui"
}

action"FE - Unit Tests" {
  uses = "actions/npm@master"
  needs = ["FE - Install Deps"]
  runs = ".github/scripts/run_commands.sh"
  args = ["cd nestpoc_ui && yarn test --coverage"]
}
