function getManPageString() {
    var man= "command  description                                status                 all region support\n"+
             "Instances and Storage Services\n"+
             "inv      display instance inventory (detailed)      ok                     yes\n"+
             "inv-     display instance inv (short form)          ok                     yes\n"+
             "inv+     display instance inv with volume info      ok                     yes\n"+
             "id       display id info                            ok                     NA, Global Service\n"+
             "trd      display cost trend info                    ok                     yes\n"+
             "vol      display EBS volume info                    ok (slow return)       yes\n"+
             "tag      display tag info                           ok                     yes\n"+
             "scg      display security group info                beta                   beta\n"+
             "ami      display AMI inventory                      ok\n"+
             "User/IAM Services\n"+
             "usr      display IAM user info                      ok                     NA, Global Service\n"+
             "grp      display IAM group info                     ok                     NA, Global Service\n"+
             "rle      display role info                          ok                     NA, Global Service\n"+
             "Billing\n"+
             "bil      display billing info (beta)                beta\n"+
             "bis      display other billing info (beta)          beta\n"+
             "Other\n"+
             "que      display SQS queue info                     ok\n"+
             "fke      display fake data (for testing the app)    ok                     NA\n"+
             "regions supported\n"+
             "E1      US_EAST_1\n"+
             "W1      US_WEST_1\n"+
             "W2      US_WEST_2\n"+
             "ALL     E1,W1,W2 (works with certain commands)";
          return(man);
}
