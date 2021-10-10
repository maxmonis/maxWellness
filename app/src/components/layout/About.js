import React from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import useToggle from '../../hooks/useToggle'

const About = () => {
  const [isDisplayed, toggle] = useToggle(false)
  const CONTACT_EMAIL = 'maxwellnesscontact@gmail.com'
  return (
    <div>
      <br />
      <TransitionGroup className='full-size'>
        {!isDisplayed ? (
          <CSSTransition key={1} timeout={500} classNames='fade'>
            <button onClick={toggle}>More Info &#x25BC;</button>
          </CSSTransition>
        ) : (
          <CSSTransition key={2} timeout={500} classNames='fade'>
            <>
              <h4>
                Thank you for visiting maxWellness
                <br /> *** <br />
                Track your workouts and personal bests along with those of up to
                twenty clients
                <br /> *** <br />
                Access your account from anywhere in the world using a securely
                encrypted password
                <br /> *** <br />
                Free of charge, ad-free and we will never share your data with
                any third party
                <br /> *** <br />
                Please direct questions, comments or concerns to
                <br /> {CONTACT_EMAIL}
              </h4>
              <br />
              <button onClick={toggle}>Hide Greeting &#x25B2;</button>
            </>
          </CSSTransition>
        )}
      </TransitionGroup>
      <br />
    </div>
  )
}

export default About
