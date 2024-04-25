import {useEffect, useRef, useState} from "react";
import clsx from "clsx";

const UserBalanceCountUp = (props) => {
    const countUpRef = useRef(null);
    const [countUpAnim, setCountUpAnim] = useState();
    const [isCountUpAnimInitiated, setIsCountUpAnimInitiated] = useState(false);

    useEffect(() => {
        initCountUp();
    }, []);

    useEffect(() => {
        if (isCountUpAnimInitiated) {
            countUpAnim.update(props.balance)
        } else {
            initCountUp()
        }
    }, [props.balance]);

    async function initCountUp() {
        const countUp = new window.CountUp(countUpRef.current, props.balance);
        setCountUpAnim(countUp);
        if (!countUp.error) {
            countUp.start();
            setIsCountUpAnimInitiated(true)
        }
    }

    return <>
        <div className="text-center mt-3">
            <p className="m-0 fs-1 fw-semibold">Your Balance</p>
            <span className="fs-2 fw-semibold text-gray-400">$</span>
            <span ref={countUpRef} className={clsx("fw-bolder fs-3x mt-5", props.color ?? "text-gray-900")}>
                0
            </span>
        </div>
    </>
}

export {UserBalanceCountUp}