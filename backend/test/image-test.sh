#!/bin/bash
cd ./image-tests
bru run './Test-1/1.bru' --insecure
bru run './Test-1/2.bru' --insecure
sleep 2
curl -k POST -H "Content-Type: multipart/form-data" -v 'file_name=testimage.jpg' -F 'display_order=0' -F 'file=@./testimage.jpg' https://localhost:8080/api/images/vehicles/id/1 --max-time 2.0
sleep 2
bru run './Test-1/4.bru' --insecure
bru run './Test-1/5.bru' --insecure
sleep 2
curl -k POST -H "Content-Type: multipart/form-data" -v 'file_name=testimage.jpg' -F 'display_order=0' -F 'file=@./testimage.jpg' https://localhost:8080/api/images/vehicleCategories/id/1 --max-time 2.0
sleep 2
bru run './Test-1/7.bru' --insecure
bru run './Test-2/1.bru' --insecure
sleep 2
curl -k POST -H "Content-Type: multipart/form-data" -v 'file_name=testimage PNG' -F 'display_order=0' -F 'file=@./pngTestimage.png' https://localhost:8080/api/images/vehicles/id/1 --max-time 2.0
sleep 2
bru run './Test-2/3.bru' --insecure
bru run './Test-3/1.bru' --insecure
sleep 2
curl -k POST -H "Content-Type: multipart/form-data" -v 'file_name=testimage GIF' -F 'display_order=0' -F 'file=@./gifTest.gif' https://localhost:8080/api/images/vehicles/id/1 --max-time 2.0
sleep 2
bru run './Test-3/1.bru' --insecure