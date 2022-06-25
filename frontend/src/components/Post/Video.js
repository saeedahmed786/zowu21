import { AudioMutedOutlined, AudioOutlined, PauseCircleFilled, PlayCircleFilled } from "@ant-design/icons";
import React, { useRef } from "react";
import "./Video.css";
import { useVideoPlayer } from "./VideoPlayer";

export const Video = () => {
    const videoElement = useRef(null);
    const {
        playerState,
        togglePlay,
        handleOnTimeUpdate,
        handleVideoProgress,
        handleVideoSpeed,
        toggleMute,
    } = useVideoPlayer(videoElement);
    return (
            <div className="video-wrapper">
                <video
                className = 'card-img-top'
                    src='/assets/recording.mp4'
                    ref={videoElement}
                    onTimeUpdate={handleOnTimeUpdate}
                />
                <div className="controls">
                    <div className="actions">
                        <button onClick={togglePlay}>
                            {!playerState.isPlaying ? (
                                <PlayCircleFilled />
                            ) : (
                                <PauseCircleFilled />
                            )}
                        </button>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={playerState.progress}
                        onChange={(e) => handleVideoProgress(e)}
                    />
                    <select
                        className="velocity"
                        value={playerState.speed}
                        onChange={(e) => handleVideoSpeed(e)}
                    >
                        <option value="0.50">0.50x</option>
                        <option value="1">1x</option>
                        <option value="1.25">1.25x</option>
                        <option value="2">2x</option>
                    </select>
                    <button className="mute-btn" onClick={toggleMute}>
                        {!playerState.isMuted ? (
                            <AudioOutlined />
                        ) : (
                            <AudioMutedOutlined />
                        )}
                    </button>
                </div>
        </div>
    );
};
