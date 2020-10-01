require('dotenv').config();
var admin = require("firebase-admin");

var serviceAccount = {
  "type": "service_account",
  "project_id": "balobe-d2a28",
  "private_key_id": "cb738c3a21971cab42ec0ed68f689cf591ed95c2",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDW//BHLVjrqDAS\nbztEYANaRZRgjOVvakT/Tn2jDMHV6DzMKs8sdd319LpzO3RhiquWOhl0pQb7KoPk\ndUoy7FdkkPa4hpmG9ifXNrHMzobR3M/vx5GUzJZDHATMORqC7JL7q4x3zHUPTzj5\nZcJ+S2rXo3CM8zPZXpra6Z6W9l9WZCsyFF2Zo40BDoxGiEPfZ3NTXF05REb9oGSy\nsBvIhmu50DP8Y7svbAX0ZN1jm+WZF1TWohGO2rB/k/FL8gYSKi9nkRthwhdgs6W1\n2SqO4yt/McmGIM0NyeRxpP52t6vMTauiYCY01zbhBimMUoDYBJJBzeXq6HJiDFLQ\nQt6ms1ypAgMBAAECggEAGEQ49X+ryqVoD5yYXuZLWpQB5Efi2YlwEjTkv1OASUl2\nG0E1svn2vH0L0lfCkgPZzBHwr5a0zAKHcnC+mDLOxl4KStd+WppL8uGMfeZNl0BK\nA/FNgDL7PsXZ0McdM+vJxzgcmaTtDXZOou+WXTTb8UzUNkR49K7V4aF+seFK73AX\n2Mcp85Z7/pClKeRV3F7902S+518ku4Ei/VJcfHtGsS6Ldty356X7Mi/BLVon18YE\nJrkYIPJfQvxjQM6HIoEjuGAvWIGMZWkzqW3aTzzd1sJmWCpCopUZ8hjnJ33mk4kI\nVmZQEIGbUpdZNbcmgCFO05a8/na8rnuwukv5vMc2gQKBgQD4OYkkjyc28Slul590\nfZtrBC9WIZ1O+YwifGFd4D97mRjaNAONz5Jng/cp2Llu5WG/qa5+7+d+XkjsxCbp\nUsl9SZ7tHYqTJsJjla7n/yDrQjHTpm8ELKThuEkArwkulIIk9PSVJQC8jGssup7M\nVbMTjsPiHLMh8cayvIVZVbzhOQKBgQDdu/p23E19lVu6pj1vzZukjcw3kzQQh/FJ\nbfI0e186LKXitwfLfRBOUHyJLYic6ZCxSW0FAECJ9FBfrs4OWWlFW903sNKILFIO\nXSmK0jxh0lPq2UVc3xPB3FG9DFfcg9f9Vd9Z3gwgjIJ91oAG5wk7zfHxE0MDomgx\nKCtvw3wG8QKBgQCgeYnpIcdHZNfVUJ7cz8unfvgfZfHuObTYIrNL3osMG+kOQGw/\nxP8wfwdOfXc8c30jTM6r7+soLkpVD2bclxH+NpdRUjThd0Ba401FXRJqJcxSuZmy\nCC68YsiHcaGtBIOy4s4wkdCNFPbA3xGEpq70KOsIhmdkvYsoyGopXB2VOQKBgE6p\nq5eTXGJbJGm5JD6PwNHGBFcLAAOFVtJoEO8RfZ0Tzd36dOd5/NjrsOKxpq+UJOLg\nW67UghDu/byUNUHd8nzKtFZXgrkQkCPMZTp8jzNc/KxqXDMwaL/zu4PH5zuyAmQ7\nnLszDTZW4sxl1pGcUShITbbq0HFvomseBxrlTRDhAoGAJSoevcu9S3i7LlqbH1s0\nG641FfeyA6WFHdvYAnIU+ycvwuGgHZ1Bz4dLKJkrN3Jw7bVWeOuThvJzC2LMMSWP\nB0omZkeWYfa4sBF0GjdmndX3l75gJpmvbVz5vXScjdhNNJRNDhFabNK9hPyjj3km\noUA5Qd0EWkA+pnMYq91HttE=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-44r2a@balobe-d2a28.iam.gserviceaccount.com",
  "client_id": "112039831810296350393",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-44r2a%40balobe-d2a28.iam.gserviceaccount.com"
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket:"balobe-d2a28.appspot.com"
});

module.exports =admin;