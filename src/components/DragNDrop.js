import React, {useState, useRef} from 'react';
import useWindowDimensions from './windowDimensions'
import sample from '../resources/sample_with_audio.mp4';

function DragNDrop({data}) {
    
    const { height, width } = useWindowDimensions();
    const[list, setList] = useState(data);
    const[Dragging, setDragging] = useState(false);

    const dragItem = useRef();
    const dragNode = useRef();
    const videoPlayPause = useRef();

    const handleDragStart = (e, params) => {
        console.log("DragStarting", params);
        dragItem.current = params;
        dragNode.current = e.target;
        dragNode.current.addEventListener("dragend", handleDragEnd)
        setTimeout(() => {
            setDragging(true);
        }, 0)
    }

    const handleTouchMove = (e, params) => {
        console.log("TouchMove", params);

        var touchLocation = e.targetTouches[0];
        console.log("targetTouches",touchLocation)
        dragItem.current = params;
        dragNode.current = e.target;

        dragNode.current.style.left = (touchLocation.pageX-150)+"px";
        dragNode.current.style.top = (touchLocation.pageY-100)+"px";


        const widthHalf = width/2;
        const heightHalf = height/2;

        var vidLeftRight = "Left";
        var vidTopBottom = "Top";
        if(touchLocation.pageX > widthHalf)
        vidLeftRight = "Right";

        if(touchLocation.pageY > heightHalf)
        vidTopBottom = "Bottom";



        dragNode.current.addEventListener("touchend", handleTouchEnd(e,vidTopBottom+vidLeftRight))
        setTimeout(() => {
            setDragging(true);
        }, 0)
    }

    const handleTouchEnd = (e,myclass) => {
        if(e.target.className != myclass){
            console.log("tagert is not same");
            setList(oldList => {
                let newList = JSON.parse(JSON.stringify(oldList));

                var currentItem = newList.findIndex(function(c) { 
                    return c.position === e.target.className; 
                });

                newList[currentItem].items = [];

                var nextItem = newList.findIndex(function(c) { 
                    return c.position === myclass; 
                });

                newList[nextItem].items = ["vidContainer"];

                //newList[params.grpI].items.splice(params.itemI, 0, newList[currentItem.grpI].items.splice(currentItem.itemI,1)[0]);
                //dragItem.current = {nextItem,0};
                return newList;
            })
        }else{
            setList(list);
        }
        setTimeout(() => {
            setDragging(true);
        }, 100)
        
    }

    const handleDragEnter = (e, params) => {
        console.log("entering Drag", params);
        const currentItem = dragItem.current;
        if(e.target !== dragNode.current){
            console.log("tagert is not same");
            setList(oldList => {
                let newList = JSON.parse(JSON.stringify(oldList));
                newList[params.grpI].items.splice(params.itemI, 0, newList[currentItem.grpI].items.splice(currentItem.itemI,1)[0]);
                dragItem.current = params
                return newList;
            })
        }
    }

    const handleDragEnd = () => {
        console.log("ending drag");
        setDragging(false);
        dragNode.current.removeEventListener("dragend", handleDragEnd);
        dragItem.current = null;
        dragNode.current = null;
    }

    const getStyles = (params) => {
        const currentItem = dragItem.current;
        if(currentItem.grpI === params.grpI && currentItem.itemI === params.itemI){ 
            return 'current dnd-item';
        }
        return 'dnd-item';
    }

    const playVideo = () => {
        if(videoPlayPause.current.paused){
            videoPlayPause.current.play();
        }else{
            videoPlayPause.current.pause();
        }
    }

    return (
        <div className="drag-n-drop">
        {list.map((grp,grpI) => (
          <div 
            key={grp.position} 
            className="dnd-group"
            onDragEnter={Dragging && !grp.items.length?(e) => handleDragEnter(e, {grpI,itemI:0}):null}
          >
            {grp.items.map((item, itemI) =>(
              <div 
              key={item} 
              className={Dragging?getStyles({grpI,itemI}):"dnd-item"}>
                <video
                ref = {videoPlayPause}
                draggable 
                onDragStart={(e) => {handleDragStart(e, {grpI,itemI})}} 
                onDragEnter = {Dragging?(e)=> {handleDragEnter(e, {grpI,itemI})}:null}
                onTouchMove={(e) => {handleTouchMove(e,{grpI,itemI})}}
                onClick={playVideo}
                 src={sample} className={grp.position}>
				</video>
              </div>
            ))}
          </div>
        ))}
        </div>
    )
}

export default DragNDrop;