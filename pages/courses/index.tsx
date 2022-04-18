import { useRouter } from 'next/router';
import React from 'react';

const Courses: React.FC = (): JSX.Element => {
    const router = useRouter();
    const { id } = router.query;
    return <div>
        <h1>Course: {id}</h1>
    </div>;
};

export default Courses;
