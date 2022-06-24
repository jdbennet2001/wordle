# wordle
A simple wordle clone, useful for testing kubernetes / docker deployments


# Docker build
docker build . -t jdbennet2001/node-wordle

# Push to default (docker.io) repository
docker login -u username -p password
docker build . -t jdbennet2001/node-wordle
docker push jdbennet2001/node-wordle

# Docker Run
docker run -p 3000:3000 jdbennet2001/node-wordle

# Stop
docker ps
docker stop <image name>

# Cleanup 
docker container prune
docker images purge

# Kube
```
kubectl apply -f wordle.yaml 
kubectl get pods
kubectl port-forward node-wordle... 3000:3000 
```

# App access
http://localhost:32222/
