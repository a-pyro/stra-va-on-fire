import React from "react"

type TypographyProps = React.HTMLAttributes<HTMLHeadingElement> & {
  children: React.ReactNode
}

export function TypographyH1(props: TypographyProps) {
  return (
    <h1
      {...props}
      className={`scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl`}
    >
      {props.children}
    </h1>
  )
}

export function TypographyH2(props: TypographyProps) {
  return (
    <h2
      {...props}
      className={`scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0`}
    >
      {props.children}
    </h2>
  )
}

export function TypographyH3(props: TypographyProps) {
  return (
    <h3
      {...props}
      className={`scroll-m-20 text-2xl font-semibold tracking-tight`}
    >
      {props.children}
    </h3>
  )
}

export function TypographyH4(props: TypographyProps) {
  return (
    <h4
      {...props}
      className={`scroll-m-20 text-xl font-semibold tracking-tight`}
    >
      {props.children}
    </h4>
  )
}

type TypographyPProps = React.HTMLAttributes<HTMLParagraphElement> & {
  children: React.ReactNode
}

export function TypographyP(props: TypographyPProps) {
  return (
    <p {...props} className={`leading-7 [&:not(:first-child)]:mt-6`}>
      {props.children}
    </p>
  )
}
