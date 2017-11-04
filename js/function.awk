


/^[ ]+function[ ]/ {

     print $0
     n=split($0,a," ");
     sz = $0
     sub(/function /,"", sz)
     sub(/)[ ]*$/,"", sz)
     print sz 

}
