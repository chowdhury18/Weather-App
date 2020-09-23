# WeatherApp

This application shows the weather information and forecast. It has two services (frontend and backend). The frontend service is built on [Reactjs](https://reactjs.org/) and the backend service is built on [Nodejs](https://nodejs.org/en/) and [Koa](https://koajs.com/). 

## Getting Started

## Pre-requisite
- Nodejs
- Docker
- Docker-compose

## Step by step
Follow the instructions to build and run the dockerize applications:

- Generate a API key for the following [link](https://openweathermap.org/) and then add the API key to your backend Dockerfile as an ENV variable.

- Go to *./backend* folder and run the command to build backend image.
```
docker build -t weatherbackend:v1 .
```
- Go to *./frontent* folder and run the command to build frontend image.
```
docker build -t weatherfrontend:v1 .
```
- To create container based on the built images, run the following commands:
```
docker run --rm  -i -p 9000:9000 --name weatherapp_backend weatherbackend:v1

docker run --rm  -i -p 8000:8000 --name weatherapp_frontend weatherfrontend:v1
```
The backend is running at [localhost:9000](http://localhost:9000) and the frontend is running at [localhost:8000](http://localhost:8000). 

- Go to the browser and check whether the frontend is running or not. 

- To check the backend API, download [postman](https://www.postman.com/) OR use command line tool [curl](https://curl.haxx.se/) to execute the operations. The following [link](https://www.taniarascia.com/making-api-requests-postman-curl/) has the instructions to execute CRUD in both postman and curl.

- The api paths are given below:

| Type | Route         | Response                                                                                                                  | Description                               |
|------|---------------|---------------------------------------------------------------------------------------------------------------------------|-------------------------------------------|
| GET  | /api/weather  | {"Date":**dt**,"Weather":{"id":**id**,"main":**main**,"description":**description**,"icon":**icon**}}                     | Get weather info of Helsinki, Finland     |
| GET  | /api/forecast | [{"Date": **dt_txt** ,"Weather":{"id": **id** ,"main": **main** ,"description": **description** ,"icon": **icon**}}, ...] | Get weather forecast of Helsinki, Finland |
| GET  | /api/location | {"Date": **dt** ,"Weather":{"id": **id** ,"main": **main** ,"description": **description** ,"icon": **icon**}}            | Get weather info of your current location |

## Docker-compose

- You can also run the application service containers using docker-compose. Run the following command to run both services at once without running individually.
```
docker-compose up
```

## Deploy to Google Cloud Platform

Follow the steps to deploy your application to google cloud platform. You can find the help in this [link](https://cloud.google.com/kubernetes-engine/docs/tutorials/hello-app#step_4_create_a_cluster).

- Install [Google Cloud SDK](https://cloud.google.com/sdk/docs/quickstarts) if you want to deploy via command-line tools locally.

- Create a new project in Google Cloud Platform (e.g., WeatherApp)

### Backend

- Create a tag
```
docker tag 629558fa7417 gcr.io/weatherapp-290318/weatherbackend:v1

# 629558fa7417 - docker ID in local machine
# gcr.io - prefix refers to [Container Registry](https://cloud.google.com/container-registry)
# weatherapp-290318 - project ID in Google Cloud Platform
```
- Push the docker image to Container Registry
```
gcloud auth configure-docker

# Configure the Docker command-line tool to authenticate to Container Registry

docker push gcr.io/weatherapp-290318/weatherbackend:v1

# Push the Docker image you just built to Container Registry
```
NOTE: remember to add sdk to PATH variable.

- Create Kubernetes cluster
```
gcloud config set project weatherapp-290318
gcloud config set compute/zone XXX
```
NOTE: chekc the zone based on your location [link](https://cloud.google.com/compute/docs/regions-zones#available).

```
gcloud container clusters create weatherapp-cluster
```

- Deploy the backend to the cluster
```
kubectl create deployment weatherbackend --image=gcr.io/weatherapp-290318/weatherbackend:v1

kubectl scale deployment weatherbackend --replicas=3
```
- Expose the application to the internet
```
kubectl expose deployment weatherbackend --name=weatherbackend-service --type=LoadBalancer --port 81 --target-port 9000

# --port: specifies the port number configured on the Load Balancer
# --target-port: specifies the port number that the weatherbackend container is listening on
```
Run the following command to set the services. The external IP (e.g., XX.XX.XX.XX) is used to access the application outside of the cluster.

```
kubectl get service
```

### Frontend

Before deploying the frontend to the cloud, please change the ENDPOINT in the webpack.config.js file in the frontend folder.
```
const GLOBALS = {
  'process.env.ENDPOINT': JSON.stringify(process.env.ENDPOINT || 'http://XX.XX.XX.XX:81/api'),
};
```
- Follow the previous instruction to deploy the frontend service to the cloud.

## Application
- I have deployed my WeatherApp in Google Cloud Platform. Check the application through this [link](http://35.228.14.142/).

