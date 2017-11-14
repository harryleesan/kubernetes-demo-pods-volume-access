# Demo - data flow between 2 pods in the same namespace

## Introduction

> **This demo is a very naive implementation, this is ONLY meant to demonstrate
> the use of `secrets` and `configmaps` as volume mounts and data flow between two
> pods via `services`. This is by NO means production ready.**

In this demo, 2 _pods_ (frontend and backend) in the same _namespace_ (`demo`) are
demonstrated to communicate with each other via 2 _services_ (frontend and backend),
where the frontend service is exposed as a _nodeport_ and the backend service is an
internal service (not exposed).

The backend pod has a _secret_ mounted as a volume. The frontend pod then requests
the backend for this _secret_ and displays it in the client browser.

The backend pod is running a Nginx web server which serves as a mock API
endpoint which exposes the _secret_ file.
The frontend pod is running a simple NodeJS web server which the client accesses
from the browser to retrieve the _secret_ content.
Since this is merely a demonstration, the pods are kept as minimalistic as
possible.


## Structure

    - backend-app
      - nginx.conf
      - secret.key
    - frontend-app
      - src
        - package.json
        - server.js
        - yarn.lock
      - Dockerfile
    - manifests
      - configmap.yml
      - deployment-backend.yml
      - deployment-frontend.yml
      - namespace.yml
      - secret.yml
    - docker-compose.yml

  - The _backend-app_ directory consists of config files that are used in the
    _docker-compose.yml_ to configure the backend app.
  - The _frontend-app_ directory consists of files that are used to build the docker
    image for the frontend app.
  - The _manifsts_ directory consists of YAML definitions for setting up the
    Kubernetes cluster for this demo.
  - The _docker-compose.yml_ can be used for testing the communication between the
    frontend app and backend app when Kubernetes/Minikube is not installed.

## Usage

### Pre-requisites

These are required for this demo:

  - kubectl and minikube
  _or_
  - docker-compose

1. Start the **minikube** cluster:

  ```bash
  minikube start
  ```

2. Build the **frontend** docker image:

  ```bash
  cd frontend-app/
  eval $(minikube docker-env)
  docker build -t myapp/frontend-test:latest .
  ```

3. Run the manifests in the following order:

  ```bash
  cd manifests/
  kubectl apply -f namespace.yml
  kubectl apply -f configmap.yml
  kubectl apply -f secret.yml
  kubectl apply -f deployment-backend.yml
  kubectl apply -f deployment-frontend.yml
  ```

  - A _namespace_ `demo` will be created.
  - A _configmap_ `nginx.conf` is used to configure the Nginx server for the
    backend to serve up the _secret_ file.
  - A _secret_ `secret.key` is created which will be used as a mounted volume in
    the backend deployment.
  - deployment-backend.yml consists of the _deployment_ and _service_ manifest
    for the backend.
  - deployment-frontend.yml consists of the _deployment_ and _service_ manifest
    for the frontend.

4. Access the _nodeport_:

  ```bash
  minikube service -n demo frontend
  ```

5. You should see `"This variable is a super secret!"` in the
   browser.

## Conclusion
This simple demonstration shows a way in which to transfer data from a mounted
volume (in this case an insecure _secret_) of one pod to another pod
requesting for the data. It is vital to note that _secrets_ are not meant to be
used in this way, this naive implementation defeats the purpose of having
secrets in the first place.
