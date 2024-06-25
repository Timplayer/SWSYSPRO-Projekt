#!/bin/bash
npm install -g @usebruno/cli
bru run './image-test/Test-1/1.bru' --insecure
bru run './image-test/Test-1/2.bru' --insecure
curl -k -X POST -H "Content-Type: multipart/form-data" -v 'file_name=testimage.jpg' -F 'display_order=0' -F 'file=@image-test/testimage.jpg' https://localhost:8080/api/images/vehicles/id/1
bru run './image-test/Test-1/4.bru' --insecure
bru run './image-test/Test-1/5.bru' --insecure
curl -k -X POST -H "Content-Type: multipart/form-data" -v 'file_name=testimage.jpg' -F 'display_order=0' -F 'file=@image-test/testimage.jpg' https://localhost:8080/api/images/vehicleCategories/id/1
bru run './image-test/Test-1/7.bru' --insecure
bru run './image-test/Test-2/1.bru' --insecure
curl -k -X POST -H "Content-Type: multipart/form-data" -v 'file_name=testimage PNG' -F 'display_order=0' -F 'file=@image-test/pngTestimage.png' https://localhost:8080/api/images/vehicles/id/1
bru run './image-test/Test-2/3.bru' --insecure
bru run './image-test/Test-3/1.bru' --insecure
curl -k -X POST -H "Content-Type: multipart/form-data" -v 'file_name=testimage GIF' -F 'display_order=0' -F 'file=@image-test/gifTest.gif' https://localhost:8080/api/images/vehicles/id/1
bru run './image-test/Test-3/1.bru' --insecure