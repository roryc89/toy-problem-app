module.exports = {

  parse : function(req, res){
            var testPage = require('../ansTests/'+req.body.funcName+'Test.js');
            var testProgress = [], successful = 0;


            try{
                eval(req.body.answer);

                for(var i = 0; i < testPage.tests.length; i++){
                  var result = eval(req.body.funcName+'.apply(null,'+JSON.stringify(testPage.tests[i].args)+')'),
                      expectedResult = testPage.tests[i].ans;

                  if(result !== expectedResult){
                      testProgress.push([testPage.tests[i].args.toString(),result,"failure"]);
                  }else{
                      testProgress.push([testPage.tests[i].args.toString(),result,"success"]);
                  }
                }

            }catch(err){
                 var status = "error";
                 testProgress[2] = "syntax error!";
                 res.send(
                  { testProgress: testProgress,
                    message: "You have a syntax error!",
                    status: status
                  }
                 );
                 return;
            };

            //if they made it here all the tests completed without eval error
            for(var i = 0; i < testProgress.length; i++){
              if(testProgress[i][2] === "success"){
                successful++;
              }
            }

            var status = (successful == testPage.tests.length) ? "success" : "failure";
            console.log(status);

            res.send(
              { testProgress: testProgress,
                message: "You passed "+successful+" out of "+testPage.tests.length+" tests!",
                status: status
              }
            );

          }
};
