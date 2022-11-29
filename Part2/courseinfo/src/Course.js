const Course = ({courses}) => {
    return (
        <>
            {courses.map((course)=>
                <div key={course.id}>
                    <h1>{course.name}</h1>
                    {course.parts.map((part)=>
                        <div key={part.id}>{part.name} {part.exercises}</div>
                    )}
                    <p>Total exercises: {course.parts.reduce((a,b)=>a+b.exercises,0)}</p>
                </div>
            )}
            </>
    )
}

export default Course