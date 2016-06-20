
Origami Image Service
=====================

Optimises and resize images. See [the production service][image-service] for API information.

[![Build status](https://img.shields.io/circleci/project/Financial-Times/origami-image-service.svg)][ci]
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)][license]


Table Of Contents
-----------------

  * [Requirements](#requirements)
  * [Running Locally](#running-locally)
  * [Configuration](#configuration)
  * [Testing](#testing)
  * Deployment [TODO]
  * Monitoring [TODO]
  * Trouble-Shooting [TODO]
  * [Project Structure](#project-structure)
    * [Orchestration Files](#orchestration-files)
  * [License](#license)


Requirements
------------

Running Origami Image Service requires a few tools:

  * [VirtualBox]: For running your Docker machine **(_Mac Only_)**
  * [Docker]: For building Docker images
  * [Docker Compose][docker-compose]: For building and running a development image
  * [Docker Machine][docker-machine]: For installing and running a Docker engine **(_Mac Only_)**
  * [Node.js] 6.x and [npm]: For running tests locally (we don't run them on the Docker images)

### Mac Guide

You can simplify some of the set up on a Mac by using the [Docker Mac set up guide][docker-mac] or [homebrew]:

```sh
brew tap caskroom/homebrew-cask
brew install brew-cask
brew cask install dockertoolbox docker-compose
```

The following command creates a virtual machine in which to run the application's containers. The default size didn't appear to be large enough so this will create one with an increased disk size:

```sh
docker-machine create --driver virtualbox --virtualbox-disk-size "50000" default
```

Add the machine's config to your current environment by running the following:

```sh
eval $(docker-machine env default)
```

In future Terminal sessions, you'll need to run the following in order to start the docker machine:

```sh
docker-machine start default
```

You'll also need to add the machine's config to your environment again using the `eval` command outlined above. Alternatively, you can add this command to your `.bash_profile` file to automatically do this.


Running Locally
---------------

Before we can run the application, we'll need to create a `.env` file. You can copy the sample file, and consult the documentation for [available options](#configuration):

```sh
cp sample.env .env
```

In the working directory, use `docker-compose` to build and start a container. We have some Make tasks which simplify this:

```sh
make build-dev run-dev
```

Now you can access the app over HTTP on port `8080`. If you're on a Mac, you'll need to use the IP of your Docker Machine:

```sh
open "http://$(docker-machine ip default):8080/"
```

To attach a bash process (for debugging, etc) to the running Docker image:

```sh
make attach-dev
```


Configuration
-------------

We configure Origami Image Service using environment variables. In development, configurations are set in a `.env` file. In production, these are set through Heroku config.

  * `PORT`: The port to run the application on.
  * `NODE_ENV`: The environment to run the application in. One of `production`, `development` (default), or `test` (for use in automated tests).
  * `LOG_LEVEL`: A Syslog-compatible level at which to emit log events to stdout. One of `trace`, `debug`, `info`, `warn`, `error`, or `crit`.
  * `PREFERRED_HOSTNAME`: The hostname to use in documentation and as a base URL in bundle requests. This defaults to `image.webservices.ft.com`.
  * `CLOUDINARY_ACCOUNT_NAME`: The name of the Cloudinary account to use in image transforms.
  * `IMGIX_SECURE_URL_TOKEN`: The Imgix secure URL token to use in image transforms.
  * `IMGIX_SOURCE_NAME`: The Imgix source name to use in image transforms.


Testing
-------

The tests are split into unit tests and integration tests. To run tests on your machine you'll need to install [Node.js] and run `make install`. Then you can run the following commands:

```sh
make test              # run all the tests
make test-unit         # run the unit tests
make test-integration  # run the integration tests
```

You can run the unit tests with coverage reporting, which expects 90% coverage or more:

```sh
make test-unit-coverage verify-coverage
```

The code will also need to pass linting on CI, you can run the linter locally with:

```sh
make verify
```

We run the tests and linter on CI, you can view [results on CircleCI][ci]. `make test` and `make lint` must pass before we merge a pull request.


Project Structure
-----------------

### Orchestration files

We use the following files in build, test and deploy automation:

  * `.dockerignore`: Used to ignore things when adding files to the Docker image.
  * `Dockerfile`: Instructions to build the web container. CI uses this as part of deployment.
  * `docker-compose.yml`: Extra instructions required for building a development Docker container.


License
-------

The Financial Times has published this software under the [MIT license][license].



[image-service]: https://image.webservices.ft.com/
[ci]: https://circleci.com/gh/Financial-Times/origami-image-service
[developer-spreadsheet]: https://docs.google.com/spreadsheets/d/1mbJQYJOgXAH2KfgKUM1Vgxq8FUIrahumb39wzsgStu0/edit#gid=0
[docker-compose]: https://docs.docker.com/compose/
[docker-mac]: http://docs.docker.com/mac/step_one/
[docker-machine]: https://docs.docker.com/machine/
[docker]: https://www.docker.com/
[heroku-pipeline]: https://dashboard.heroku.com/pipelines/9cd9033e-fa9d-42af-bfe9-b9d0aa6f4a50
[heroku-production]: https://dashboard.heroku.com/apps/origami-image-service
[heroku-qa]: https://dashboard.heroku.com/apps/origami-image-service-qa
[heroku]: https://heroku.com/
[homebrew]: http://brew.sh/
[license]: http://opensource.org/licenses/MIT
[node.js]: https://nodejs.org/
[npm]: https://www.npmjs.com/
[semver]: http://semver.org/
[virtualbox]: https://www.virtualbox.org/
