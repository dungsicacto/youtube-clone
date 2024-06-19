import React, { useEffect, useState } from "react";
import "./PlayVideo.css";
import video1 from "../../assets/video.mp4";
import like from "../../assets/like.png";
import dislike from "../../assets/dislike.png";
import share from "../../assets/share.png";
import save from "../../assets/save.png";
import jack from "../../assets/jack.png";
import user_profile from "../../assets/user_profile.jpg";
import { API_KEY, value_converter } from "../../data.js";
import moment from "moment";
import { useParams } from "react-router-dom";


const PlayVideo = () => {

  const {videoId} = useParams()

  const [apiData, setApiData] = useState(null)
  const [channelData, setChannelData] = useState(null)
  const [commentsData, setCommentsData] = useState([])

  const getVideoData = async () => {
    const videoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails,statistics&key=${API_KEY}`
    await fetch(videoDetailsUrl)
      .then(res => res.json())
      .then(data => setApiData(data.items[0]))
  }

  const getOtherData = async () => {
    const channelDataUrl = `https://www.googleapis.com/youtube/v3/channels?id=${apiData.snippet.channelId}&part=snippet,contentDetails,statistics&key=${API_KEY}`
    await fetch(channelDataUrl)
      .then(res => res.json())
      .then(data => setChannelData(data.items[0]))

    const conmmentUrl = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&maxResult=50&videoId=${videoId}&key=${API_KEY}`
    await fetch(conmmentUrl)
      .then(res => res.json())
      .then(data => setCommentsData(data.items))
  }

  useEffect(() => {
    getVideoData()
  }, [videoId])

  useEffect(() => {
    getOtherData()
  }, [apiData])

  return (
    <div className="play-video">
      {/* <video src={video1} controls autoPlay></video> */}
      <iframe src={`https://www.youtube.com/embed/${videoId}?autoPlay=1`} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
      <h3>{apiData ? apiData.snippet.title : ""}</h3>
      <div className="play-video-info">
        <p>{apiData ? value_converter(apiData.statistics.viewCount) : '0'} Views &bull; {apiData ? moment(apiData.snippet.publishedAt).fromNow() : ''} </p>
        <div>
          <span>
            <img src={like} alt="" />
            {apiData ? value_converter(apiData.statistics.likeCount) : '0'}
          </span>
          <span>
            <img src={dislike} alt="" />
          </span>
          <span>
            <img src={share} alt="" />
            Share
          </span>
          <span>
            <img src={save} alt="" />
            Save
          </span>
        </div>
      </div>
      <hr />
      <div className="publisher">
        <img src={channelData ? channelData.snippet.thumbnails.default.url : 'jack'} alt="" />
        <div>
          <p>{apiData ? apiData.snippet.channelTitle : 'Channel Title'}</p>
          <span>{channelData ? value_converter(channelData.statistics.subscriberCount) : 0} Subcribers</span>
        </div>
        <button>Subscibe</button>
      </div>
      <div className="vid-desc">
        <p>{apiData ? apiData.snippet.description.slice(0, 250) : ''}</p>
        <hr />
        <h4>{apiData ? value_converter(apiData.statistics.commentCount) : 0} Comments</h4>
        {commentsData.map((item, index) => {
          return (
            <div className="comment" key={index}>
              <img src={item.snippet.topLevelComment.snippet.authorProfileImageUrl} alt="" />
              <div>
                <h3>
                  {item.snippet.topLevelComment.snippet.authorDisplayName}<span>{moment(item.snippet.topLevelComment.snippet.publishedAt).fromNow()}</span>
                </h3>
                <p>
                  {item.snippet.topLevelComment.snippet.textDisplay}
                </p>
                <div className="comment-action">
                  <img src={like} alt="" />
                  <span>{value_converter(item.snippet.topLevelComment.snippet.likeCount)}</span>
                  <img src={dislike} alt="" />
                  <span>{ }</span>
                </div>
              </div>
            </div>
          )
        })}


      </div>
    </div>
  );
};

export default PlayVideo;
