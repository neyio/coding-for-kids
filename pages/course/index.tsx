import React from 'react'
import dynamic from 'next/dynamic'

const Course = dynamic(
    () => import('./Course'),
    { ssr: false }
)

export default function CoursePage() {
    return <Course />
}