/**
 * General Configure Vars
 */

var FDR_TEMPLATE = "/tpl/";
var WINDOW_HEIGHT = window.innerHeight;

var EXPEND_HEADER_HEIGHT = 65;

var SHRINK_HEADER_HEIGHT = 20;

var HEADER_EXPEND_STATE = "Expend";

var HEADER_SHRINK_STATE = "Shrink";

var MAIN_BODY_HEIGHT = WINDOW_HEIGHT - EXPEND_HEADER_HEIGHT;

var EVT_ADD_TICKET = "add ticket";

var DEVICE = {platform:"unknown"};

var EVT_COUNTING_FINISHED = 'counting_finished';

var EVT_COUNTING_CHANGED = 'counting_changed';

var SQLITE_DB_GENERAL = 'lifeplusGeneral.db';
function removeElement(item,array)
{
    for(var i=0; i<array.length; i++)
    {
        if(array[i] == item)
        {
            if(index>=0 && index<array.length)
            {
                for(var i=index; i<array.length; i++)
                {
                    array[i] = array[i+1];
                }
                array.length = array.length-1;
            }
        }
    }
    return array;
}