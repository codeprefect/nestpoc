workflow "Backend: Test - Build - Publish" {
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
  secrets = ["DOCKER_REGISTRY_URL", "DOCKER_USERNAME", "REPO_NAME", "BACKEND_IMAGE"]
  args = "build -t $DOCKER_REGISTRY_URL/$DOCKER_USERNAME/$REPO_NAME/$BACKEND_IMAGE:latest ./$BACKEND_IMAGE"
}

action "Publish Image" {
  uses = "actions/docker/cli@8cdf801b322af5f369e00d85e9cf3a7122f49108"
  needs = ["Build Image"]
  secrets = ["DOCKER_REGISTRY_URL", "DOCKER_USERNAME", "REPO_NAME", "BACKEND_IMAGE"]
  args = "push $DOCKER_REGISTRY_URL/$DOCKER_USERNAME/$REPO_NAME/$BACKEND_IMAGE"
}

action "Install Yarn" {
  uses = "actions/npm@master"
  args = "install yarn -g"
}

action "Install Deps" {
  needs = ["Install Yarn"]
  uses = "actions/npm@master"
  runs = ".github/scripts/install_deps.sh nestpoc_api"
}

action "Create ormconfig" {
  uses = "jcblw/bash@master"
  needs = ["Install Deps"]
  args = ["cd nestpoc_api && echo $ORM_CONFIG | base64 --decode > ./ormconfig.json"]
  secrets = ["ORM_CONFIG"]
}

action "Run Migrations" {
  needs = ["Create ormconfig"]
  uses = "actions/npm@master"
  runs = ".github/scripts/db_migrate.sh"
}

action "Unit Tests" {
  needs = ["Run Migrations"]
  uses = "actions/npm@master"
  runs = ".github/scripts/run_commands.sh"
  args = ["cd nestpoc_api && yarn test:unit --coverage"]
}
