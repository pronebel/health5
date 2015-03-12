Starter_Service.factory('PushUp',['orientationTrackingService','vibrationNotificationService','countingService',
    function(orientationTrackingService,vibrationNotificationService,countingService){


        var trackIds = [];
        var counterTrackIds = {};

        /**
         * 删除一个pushup-tracking
         * @param trackId
         */
        var del =  function(trackId) {
            orientationTrackingService.del(trackId);
            coungintService.del(counterTrackIds[trackId]);
        }


        /**
         * 基数设置
          * @type {{target: number, touchstone: string[]}}
         */
        var defaults = {

            target: 12,//单位组动作个数
            touchstone:['y<-50','y>-10']//姿态标准阀值
        }


        /**
         * 设置标准动作完成后的反馈
         * @param trackId
         * @param callback
         */
        var setChangedCallback= function(trackId, callback){
            var counterTrackId = counterTrackIds[trackId];
            countingService.setChangedCallback(counterTrackId, function(event,args){
                callback(args);
            });
        }

        /**
         * 设置训练组完成后的反馈
         * @param trackId
         * @param callback
         */
        var setFinishedCallback=function(trackId, callback){
            var counterTrackId = counterTrackIds[trackId];
            countingService.setFinishCallback(counterTrackId, function(event,args){
                callback(args);
            });
        }


        /**
         * 初始化一个pushup-tracking
         * @returns {*}
         */
        var add = function(options){

            var opts  =angular.extend(defaults,options);

            console.log(opts);

            var trackId = orientationTrackingService.add();

            var counterTrackId = countingService.addCounting(opts.target);

            orientationTrackingService.setTask(trackId,opts.touchstone,true,
                function(tracker){
                   // vibrationNotificationService.vibrateNotice();
                },
                function(tracker){
                    countingService.accumulate(counterTrackId);
                }
            );
            trackIds.push(trackId);
            counterTrackIds[trackId] = counterTrackId;

            setChangedCallback(trackId,opts.change);
            setFinishedCallback(trackId,opts.finish);

            return trackId;
        }
        return {
            start:add,
            end:del
        }
    }]);

