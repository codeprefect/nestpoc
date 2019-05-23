workflow "Build Docker Images" {
  on = "push"
  resolves = [
    "Publish Frontend Image",
    "Publish Backend Image"
  ],
}

action "Docker Registry" {
  uses = "actions/docker/login@8cdf801b322af5f369e00d85e9cf3a7122f49108"
  secrets = ["DOCKER_REGISTRY_URL", "DOCKER_USERNAME", "DOCKER_PASSWORD"]
}

action "Build Backend Image" {
  uses = "actions/docker/cli@8cdf801b322af5f369e00d85e9cf3a7122f49108"
  needs = ["Docker Registry"]
  secrets = ["DOCKER_REGISTRY_URL", "DOCKER_USERNAME"]
  env = {
    BACKEND_IMAGE = "nestpoc-api",
    REPO_NAME = "nest-poc"
  }
  args = "build -t $DOCKER_REGISTRY_URL/$DOCKER_USERNAME/$REPO_NAME/$BACKEND_IMAGE:latest ./nestpoc-api"
}

action "Build Frontend Image" {
  uses = "actions/docker/cli@8cdf801b322af5f369e00d85e9cf3a7122f49108"
  needs = ["Docker Registry"]
  secrets = ["DOCKER_REGISTRY_URL", "DOCKER_USERNAME"]
  env = {
    FRONTEND_IMAGE = "nestpoc-ui",
    REPO_NAME = "nest-poc"
  }
  args = "build -t $DOCKER_REGISTRY_URL/$DOCKER_USERNAME/$REPO_NAME/$FRONTEND_IMAGE:latest ./nestpoc-ui"
}

action "Publish Backend Image" {
  uses = "actions/docker/cli@8cdf801b322af5f369e00d85e9cf3a7122f49108"
  needs = ["Build Backend Image"]
  secrets = ["DOCKER_REGISTRY_URL", "DOCKER_USERNAME"]
  env = {
    BACKEND_IMAGE = "nestpoc-api",
    REPO_NAME = "nest-poc"
  }
  args = "push $DOCKER_REGISTRY_URL/$DOCKER_USERNAME/$REPO_NAME/$BACKEND_IMAGE"
}

action "Publish Frontend Image" {
  uses = "actions/docker/cli@8cdf801b322af5f369e00d85e9cf3a7122f49108"
  needs = ["Build Frontend Image"]
  secrets = ["DOCKER_REGISTRY_URL", "DOCKER_USERNAME"]
  env = {
    FRONTEND_IMAGE = "nestpoc-ui",
    REPO_NAME = "nest-poc"
  }
  args = "push $DOCKER_REGISTRY_URL/$DOCKER_USERNAME/$REPO_NAME/$FRONTEND_IMAGE"
}
