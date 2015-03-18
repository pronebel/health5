Starter_Service.factory('PushUp',['orientationTrackingService','countingService','SoundService','localStorageService',
    function(orientationTrackingService,countingService,soundService,localStorageService){


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

            // 我的 [-17,-85]
            touchstone:['y<-50','y>-20']//姿态标准阀值  ,   正面的阀值基础上，比如[-70,-20],减 90 为 [-150,-110], 取镜像 [20,70] [110,150] 为四个维度的阀值，
            //可以根据一个阀值相应的找到四个手机放置状态的阀值
        }

        try {
            var maxY = parseInt(localStorageService.get("maxY"));
            var minY = parseInt(localStorageService.get("minY"));

            trackDefOptions.touchstone[0] = 'y<' + (minY + 10);
            trackDefOptions.touchstone[1] = 'y>' + (maxY - 10);


            console.log(trackDefOptions.touchstone)
        }catch(ex){
            console.log(ex);
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

