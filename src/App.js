import "./App.css";
import { useEffect, useState } from "react";
import { fromEvent, interval, Subject } from "rxjs";
import { buffer, debounceTime, filter, map, takeUntil } from "rxjs/operators";

const setHours = (time) => {
  const hours = Math.trunc(time / 3600);
  if (hours < 10) {
    return `0${hours}`;
  }
  return hours;
};

const setMinutes = (time) => {
  const minutes = Math.trunc((time - 3600 * Math.trunc(time / 3600)) / 60);
  if (minutes < 10) {
    return `0${minutes}`;
  }
  return minutes;
};
const setSeconds = (time) => {
  const seconds =
    time - Math.trunc((time - 3600 * Math.trunc(time / 3600)) / 60) * 60;
  if (seconds < 10) {
    return `0${seconds}`;
  }
  return seconds;
};

const App = () => {
  const [status, setStatus] = useState("stop");
  const [time, setTime] = useState(0);

  useEffect(() => {
    const unsubscribe$ = new Subject();
    const timer$ = interval(1000);
    const click$ = fromEvent(document, "click");

    const doubleClick$ = click$.pipe(
      buffer(click$.pipe(debounceTime(300))),
      map((list) => {
        return list.length;
      }),
      filter((x) => x === 2)
    );
    if (status === "start") {
      timer$.pipe(takeUntil(unsubscribe$), takeUntil(doubleClick$)).subscribe({
        next: () => {
          setTime((val) => val + 1);
        },
        complete: () => {
          setStatus("stop");
        },
      });
    }

    return () => {
      unsubscribe$.next();
      unsubscribe$.complete();
    };
  }, [status]);

  const start = () => {
    if (status !== "start") {
      setStatus("start");
    }
  };

  const stop = () => {
    setStatus("stop");
    setTime(0);
  };
  const reset = () => {
    setTime(0);
  };
  const wait = () => {};
  console.log(time);
  return (
    <div className={"App"}>
      <div>{`${setHours(time)}:${setMinutes(time)}:${setSeconds(time)}`}</div>
      <button
        onClick={() => {
          start();
        }}
      >
        start
      </button>
      <button
        onClick={() => {
          stop();
        }}
      >
        stop
      </button>
      <button
        onClick={() => {
          reset();
        }}
      >
        reset
      </button>
      <button
        onClick={(e) => {
          wait();
        }}
      >
        wait
      </button>
    </div>
  );
};

export default App;
