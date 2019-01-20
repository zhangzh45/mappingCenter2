FROM node:6.10.2-alpine
ADD  mappingCenter /mappingCenter/
WORKDIR /mappingCenter
EXPOSE 3000
CMD ["node","app.js"]
