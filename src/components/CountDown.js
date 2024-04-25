import React, {useEffect, useRef, useState} from "react";
import Tick from "@pqina/flip";

import styled from "styled-components";

export const StyledTimeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
`;

export const StyledTimeLastContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const CountDown = ({value}) => {
    const divRef = useRef();
    const tickRef = useRef();

    const [tickValue, setTickValue] = useState(value);

    // Make the Tick instance and store it in the refs
    useEffect(() => {
        const didInit = (tick) => {
            tickRef.current = tick;
        };

        const currDiv = divRef.current;
        const tickValue = tickRef.current;
        Tick.DOM.create(currDiv, {
            value,
            didInit
        });
        return () => Tick.DOM.destroy(tickValue);
    }, [value]);

    // Start the Tick.down process
    useEffect(() => {
        const counter = Tick.count.down(value, {
            format: ["d", "h", "m", "s"]
        });

        // When the counter updates, update React's state value
        counter.onupdate = function (value) {
            setTickValue(value);
        };

        return () => {
            counter.timer.stop();
        };
    }, [value]);

    // When the tickValue is updated, update the Tick.DOM element
    useEffect(() => {
        if (tickRef.current) {
            tickRef.current.value = {
                days: tickValue[0],
                hours: tickValue[1],
                mins: tickValue[2],
                secs: tickValue[3]
            };
        }
    }, [tickValue]);

    return (
        <div className="row justify-content-center">
            <div className={"col-sm-12"}>
                <div className="tick d-flex justify-content-center">
                    <div data-repeat="true" data-layout="horizontal fit">
                        <div className="tick-group" style={{}}>
                            <div ref={divRef} style={{display: "flex"}}>
                                <StyledTimeContainer>
                                    <div
                                        data-key="days"
                                        data-repeat="true"
                                        data-transform="pad(00) -> split -> delay"
                                    >
                                        <span data-view="flip"></span>
                                    </div>
                                    <p
                                        className="tick-text-inline tick-label mt-2 fw-semibold"
                                        style={{color: "black", margin: 0}}
                                    >
                                        Day{tickValue[0] === 1 ? "" : "s"}
                                    </p>
                                </StyledTimeContainer>

                                <StyledTimeContainer>
                                    <div
                                        data-key="hours"
                                        data-repeat="true"
                                        data-transform="pad(00) -> split -> delay"
                                    >
                                        <span data-view="flip"></span>
                                    </div>
                                    <p
                                        className="tick-text-inline tick-label mt-2 fw-semibold"
                                        style={{color: "black", margin: 0}}
                                    >
                                        Hour{tickValue[1] <= 1 ? "" : "s"}
                                    </p>
                                </StyledTimeContainer>

                                <StyledTimeContainer>
                                    <div
                                        data-key="mins"
                                        data-repeat="true"
                                        data-transform="pad(00) -> split -> delay"
                                    >
                                        <span data-view="flip"></span>
                                    </div>
                                    <p
                                        className="tick-text-inline tick-label mt-2 fw-semibold"
                                        style={{color: "black", margin: 0}}
                                    >
                                        Minute{tickValue[2] <= 1 ? "" : "s"}
                                    </p>
                                </StyledTimeContainer>

                                <StyledTimeLastContainer>
                                    <div
                                        data-key="secs"
                                        data-repeat="true"
                                        data-transform="pad(00) -> split -> delay"
                                    >
                                        <span data-view="flip"></span>
                                    </div>
                                    <p
                                        className="tick-text-inline tick-label mt-2 fw-semibold"
                                        style={{color: "black", margin: 0}}
                                    >
                                        Sec{tickValue[3] <= 1 ? "" : "s"}
                                    </p>
                                </StyledTimeLastContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CountDown;
