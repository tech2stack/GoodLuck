import React from 'react';
import styled from 'styled-components';
import DetailsBar from '../components/DetailsBar';
import InputSide from '../components/InputSide';
import bgImage from '../assets/bg.jpg';
import "../styles/Contact.css";

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  background: url(${bgImage}) center/cover no-repeat;
  background-attachment: fixed;
  position: relative;
`;

// Dark semi-transparent overlay
const Overlay = styled.div`
  background-color: rgba(0, 0, 0, 0.6); /* Darken for text readability */
  min-height: 100vh;
  width: 100%;
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// Heading and subtitle
const PageHeadingWrapper = styled.div`
  margin-bottom: 40px;
  text-align: center;
`;

const TextOne = styled.h1`
  font-size: 48px;
  color: #ffffff;
  text-shadow: 2px 2px 8px rgba(0, 255, 170, 0.8);
  margin-bottom: 10px;
  font-family: 'Segoe UI', sans-serif;
`;

const TextTwo = styled.p`
  font-size: 18px;
  color: #f0f0f0;
  max-width: 600px;
  margin: 0 auto;
`;

// Form container with glassmorphism
const FormContainer = styled.div`
  width: 70%;
  min-width: 600px;
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    width: 90%;
    min-width: 0;
  }
`;

const FormPage = () => {
  return (
    <PageWrapper>
      <Overlay>
        <PageHeadingWrapper>
          <TextOne>Contact Us</TextOne>
          <TextTwo>
            Any questions or remarks? We'd love to hear from you — just send us a message!
          </TextTwo>
        </PageHeadingWrapper>

        <FormContainer>
          <DetailsBar />
          <InputSide />
        </FormContainer>
      </Overlay>
    </PageWrapper>
  );
};

export default FormPage;
