workflow "Build Docker Images" {
  on = "push"
  resolves = ["GitHub Action for Docker"]
}

action "Docker Registry" {
  uses = "actions/docker/login@8cdf801b322af5f369e00d85e9cf3a7122f49108"
  secrets = ["DOCKER_REGISTRY_URL", "DOCKER_USERNAME", "DOCKER_PASSWORD"]
}

action "GitHub Action for Docker" {
  uses = "actions/docker/cli@8cdf801b322af5f369e00d85e9cf3a7122f49108"
  needs = ["Docker Registry"]
  secrets = ["DOCKER_REGISTRY_URL", "DOCKER_USERNAME"]
  env = {
    BACKEND_IMAGE = "nestpoc-api"
  }
  args = "build -t $DOCKER_REGISTRY_URL/$DOCKER_USERNAME/$BACKEND_IMAGE:latest ./nestpoc-api"
}
