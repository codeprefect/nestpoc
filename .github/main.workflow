workflow "Build Docker Images" {
  on = "push"
  resolves = [
    "Publish Frontend Image",
    "Publish Backend Image",
    "Run migrations",
  ]
}

action "Docker Registry" {
  uses = "actions/docker/login@8cdf801b322af5f369e00d85e9cf3a7122f49108"
  secrets = ["DOCKER_REGISTRY_URL", "DOCKER_USERNAME", "DOCKER_PASSWORD"]
}

action "Build Backend Image" {
  uses = "actions/docker/cli@8cdf801b322af5f369e00d85e9cf3a7122f49108"
  needs = ["Docker Registry"]
  secrets = ["DOCKER_REGISTRY_URL", "DOCKER_USERNAME", "REPO_NAME", "BACKEND_IMAGE"]
  args = "build -t $DOCKER_REGISTRY_URL/$DOCKER_USERNAME/$REPO_NAME/$BACKEND_IMAGE:latest ./$BACKEND_IMAGE"
}

action "Build Frontend Image" {
  uses = "actions/docker/cli@8cdf801b322af5f369e00d85e9cf3a7122f49108"
  needs = ["Docker Registry"]
  secrets = ["DOCKER_REGISTRY_URL", "DOCKER_USERNAME", "REPO_NAME", "FRONTEND_IMAGE"]
  args = "build -t $DOCKER_REGISTRY_URL/$DOCKER_USERNAME/$REPO_NAME/$FRONTEND_IMAGE:latest ./$FRONTEND_IMAGE"
}

action "Publish Backend Image" {
  uses = "actions/docker/cli@8cdf801b322af5f369e00d85e9cf3a7122f49108"
  needs = ["Build Backend Image"]
  secrets = ["DOCKER_REGISTRY_URL", "DOCKER_USERNAME", "REPO_NAME", "BACKEND_IMAGE"]
  args = "push $DOCKER_REGISTRY_URL/$DOCKER_USERNAME/$REPO_NAME/$BACKEND_IMAGE"
}

action "Publish Frontend Image" {
  uses = "actions/docker/cli@8cdf801b322af5f369e00d85e9cf3a7122f49108"
  needs = ["Build Frontend Image"]
  secrets = ["DOCKER_REGISTRY_URL", "DOCKER_USERNAME", "REPO_NAME", "FRONTEND_IMAGE"]
  args = "push $DOCKER_REGISTRY_URL/$DOCKER_USERNAME/$REPO_NAME/$FRONTEND_IMAGE"
}

action "Create ormconfig" {
  uses = "jcblw/bash@master"
  args = ["cd nestpoc_api && echo $ORM_CONFIG | base64 --decode > ./ormconfig.json && ls ."]
  secrets = ["ORM_CONFIG"]
}

action "Run migrations" {
  needs = ["Create ormconfig"]
  uses = "actions/npm@master"
  runs = ".github/nestpoc_api_migrate.sh"
}
