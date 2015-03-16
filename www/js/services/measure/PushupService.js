Starter_Service.factory('PushUp',['orientationTrackingService','countingService','SoundService',
    function(orientationTrackingService,countingService,soundService){


        var trackIds = [];
        var counterTrackIds = {};

        /**
         * 基数设置
          *
         */

        var countDefOptions = {
            goal:12
        }

        var trackDefOptions = {

            touchstone:['y<-50','y>-10']//姿态标准阀值
        }


        /**
         * 删除一个pushup-tracking
         * @param trackId
         */
        var stop =  function(trackId) {
            console.log("stoping...");
            orientationTrackingService.del(trackId);
            countingService.del(counterTrackIds[trackId]);
        }

        /**
         * 初始化一个pushup-tracking
         * @returns {*}
         */
        var add = function(countOptions,trackOptions){

            soundService.start();

            var countOpts  =angular.extend(countDefOptions,countOptions);
            var trackOpts  =angular.extend(trackDefOptions,trackOptions);

            var counterTrackId = countingService.create(countOpts);
            var trackId = orientationTrackingService.create(counterTrackId,trackOpts);


            trackIds.push(trackId);
            counterTrackIds[trackId] = counterTrackId;



            return trackId;
        }
        return {
            start:add,
            stop:stop
        }
    }]);

