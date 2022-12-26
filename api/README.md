## Build image

```bash
docker build -f Dockerfile -t socialassetapi .
```

## Run image

```bash
docker run -d -p 3001:3001 --name socialassetapi socialassetapi

```

## Stop image

```bash
docker stop socialassetapi
```

## Delete image

```bash
docker rm CONTAINER_ID
docker image rm -f socialassetapi
docker images
docker rmi IMAGE_ID
```

## Enter shell

docker exec -it socialassetapi /bin/sh

## Deploy to ACR

az acr build --image socialassetapi:v1.11 --registry primerbrand --file Dockerfile .

## Set permissions on App Service ACR

az acr update -n primerbrand --admin-enabled true
