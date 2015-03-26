Starter_Service.factory('PushUp', ['$cordovaDeviceMotion', 'SoundService', 'localStorageService',
    function ($cordovaDeviceMotion, soundService, localStorageService) {



        var CURRENT_ACCELERATION = {};

        var __watch = null;


        //Static

        var CONST_STATUS={
            STOPPED:0,
            STARTING:1,
            RUNNING:2,
            ERROR_FAILED_TO_START:3
        }


        var status, lastAccessTime;

        var CURRENT_STEP = 0, SENSITIVITY = 0;

        var mLastValues = [];//new float[3 * 2];
        var mScale = [];//new float[2];
        var mYOffset, end = 0, start = 0;

        var mLastDirections = [];//new float[3 * 2];

        // private float mLastExtremes[][] = { new float[3 * 2], new float[3 * 2] };
        var mLastExtremes;
        var mLastDiff=[];//new float[3 * 2];

        var mLastMatch = -1;

        var init = function(){
            var h =480;
            mYOffset = h * 0.5;


        }


        var getCurrentAcceleration = function(){
            $cordovaDeviceMotion.getCurrentAcceleration().then(function(result) {
               /* var X = result.x;
                var Y = result.y;
                var Z = result.z;
                var timeStamp = result.timestamp;*/

                CURRENT_ACCELERATION = result;


            }, function(err) {
                // An error occurred. Show a message to the user
            });

        }



        var setStatus=function(_status){
            status = _status;
        }

        var stop = function(){
            if(status!= CONST_STATUS.STOPPED){
                //this.sensorManager.unregisterListener(this);
            }
            setStatus(CONST_STATUS.STOPPED);

        }


        var stop

        return {

            getStatus:function(){
                return status;
            },
            getCurrentStep:function(){
                return CURRENT_STEP;
            },

            setStatus:setStatus,
            stop:stop



        }


    }
]);