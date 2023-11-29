FROM node:16.20.2 
WORKDIR /osint
#RUN apt-get install ng-common -y
RUN npm install -g @angular/cli@16 
COPY . .
RUN npm install
#RUN npm run build
EXPOSE 4400
CMD ["ng", "serve", "--host", "0.0.0.0"]
