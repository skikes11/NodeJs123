MONGODB_URL= mongodb://localhost:27017/ABC
JWT_ACCESS_KEY = S@#TEFWDSG$DSUVJZAEWV23risy4euafwusfasfas
GOOGLE_MAILER_CLIENT_ID = 1026373301857-j493jqie87afsvsqp4uda9mie7tphhse.apps.googleusercontent.com
GOOGLE_MAILER_CLIENT_SECRET = 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
GOOGLE_MAILER_REFRESH_TOKEN = 1//04LWgY-VQUD_hCgYIARAAGAQSNwF-L9IrUn1Xqn0qyvr_QttIIZka8HrSso2JcinPO5isWxO0h-VshTC-sf61Z7Kzwx7aPTcwmx8

FACEBOOK_CLIENT_ID = 1067140857524706
FACEBOOK_CLIENT_SECRET = 8900c33322dd2b65acb6637cd1b40b2a

GOOGLE_CLIENT_ID = 1044223900179-tfsboch1jobrpskea2n3ofnbti75a3vi.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET = 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





ENDPOINT: 
- /products : Get all product have quantity greater than 0 
- /orders : get all order of user
- /cart : get all product in user cart 
- /orderItems ...


CREATE AUDIT LOG(DATABASE)
- TIME ? 
- WHO ? 
- WHAT API ?
- DATABASE UPDATE ? 
+ if(UPDATE){
        OLD ITEM,
        NEW ITEM
}else if(DELETE){
        ITEM DELELE
}else if(CREATE){
        NEW ITEM
}
