import React, { useState, useEffect } from "react"
import RecordList from "./RecordList"
import WorkoutList from "../stats/WorkoutList"

const StatsApp = ({
  workouts,
  records,
  appliedFilterCount,
  updateWorkouts,
  editWorkout,
  updateRoutine,
  selectExercise,
}) => {
  const [display, setDisplay] = useState("workouts")
  const [workoutsIndex, setWorkoutsIndex] = useState(0)
  const [recordsIndex, setRecordsIndex] = useState(0)
  const increment = (list = display) => {
    if (list === "workouts" && workoutsIndex < workouts.length - 3) {
      setWorkoutsIndex(workoutsIndex + 3)
    } else if (list === "records" && recordsIndex < records.length - 5) {
      setRecordsIndex(recordsIndex + 5)
    }
  }
  const decrement = (list = display) => {
    if (list === "workouts" && workoutsIndex) {
      setWorkoutsIndex(workoutsIndex - 3)
    } else if (list === "records" && recordsIndex) {
      setRecordsIndex(recordsIndex - 5)
    }
  }
  useEffect(() => {
    setWorkoutsIndex(0)
    setRecordsIndex(0)
  }, [appliedFilterCount])
  return (
    <>
      <section className="show-gt-992">
        <div className="flex-row center mb-3">
          <button
            className={workoutsIndex ? "" : "opacity-0 cursor-default"}
            onClick={() => decrement("workouts")}>
            <h3>{"<-"}</h3>
          </button>
          <h3 className="mx-5">Workouts</h3>
          <button
            className={
              workoutsIndex < workouts.length - 3
                ? ""
                : "opacity-0 cursor-default"
            }
            onClick={() => increment("workouts")}>
            <h3>{"->"}</h3>
          </button>
        </div>
        <WorkoutList
          workouts={workouts}
          updateWorkouts={updateWorkouts}
          editWorkout={editWorkout}
          updateRoutine={updateRoutine}
          workoutsIndex={workoutsIndex}
        />
      </section>
      <section className="show-gt-992">
        <div className="flex-row center mb-3">
          <button
            className={recordsIndex ? "" : "opacity-0 cursor-default"}
            onClick={() => decrement("records")}>
            <h3>{"<-"}</h3>
          </button>
          <h3 className="mx-5">Records</h3>
          <button
            onClick={() => increment("records")}
            className={
              recordsIndex < records.length - 5
                ? ""
                : "opacity-0 cursor-default"
            }>
            <h3>{"->"}</h3>
          </button>
        </div>
        <RecordList
          records={records}
          selectExercise={selectExercise}
          recordsIndex={recordsIndex}
        />
      </section>
      <section className="hide-gt-992">
        <div className="flex-row center mb-3">
          <button
            className={
              (display === "workouts" && workoutsIndex) ||
              (display === "records" && recordsIndex)
                ? "mr-5"
                : "mr-5 opacity-0 cursor-default"
            }
            onClick={() => decrement(display)}>
            <h3>{"<-"}</h3>
          </button>
          <h3>
            <span
              className={
                display === "workouts"
                  ? "cursor-pointer underline"
                  : "cursor-pointer"
              }
              onClick={() => setDisplay("workouts")}>
              Workouts
            </span>
            &nbsp;|&nbsp;
            <span
              className={
                display === "records"
                  ? "cursor-pointer underline"
                  : "cursor-pointer"
              }
              onClick={() => setDisplay("records")}>
              Records
            </span>
          </h3>
          <button
            className={
              (display === "workouts" && workoutsIndex < workouts.length - 3) ||
              (display === "records" && recordsIndex < records.length - 5)
                ? "ml-5"
                : "ml-5 opacity-0 cursor-default"
            }
            onClick={() => increment(display)}>
            <h3>{"->"}</h3>
          </button>
        </div>
        {display === "records" ? (
          <RecordList
            records={records}
            selectExercise={selectExercise}
            recordsIndex={recordsIndex}
          />
        ) : (
          <WorkoutList
            workouts={workouts}
            updateWorkouts={updateWorkouts}
            editWorkout={editWorkout}
            updateRoutine={updateRoutine}
            workoutsIndex={workoutsIndex}
          />
        )}
      </section>
    </>
  )
}

export default StatsApp
