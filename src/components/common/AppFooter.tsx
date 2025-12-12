// src/components/common/AppFooter.tsx
import {
  Footer,
  FooterContent,
  FooterGrid,
  FooterColumn,
  FooterTitle,
  FooterLink,
  FooterText,
  FooterLogo,
  SocialLinks,
  SocialLink,
  FooterBottom,
  Copyright,
  FooterLinks,
  FooterBottomLink,
} from './Footer';
import { LightningIcon, ChatIcon } from './Icons';

export const AppFooter = () => {
  return (
    <Footer>
      <FooterContent>
        <FooterGrid>
          <FooterColumn>
            <FooterLogo to="/">RewardFlow</FooterLogo>
            <FooterText>
              The modern task management platform with Web3 integration, AI-powered features, and real-time collaboration.
            </FooterText>
            <SocialLinks>
              <SocialLink href="#" aria-label="Twitter">𝕏</SocialLink>
              <SocialLink href="#" aria-label="GitHub"><LightningIcon size={20} /></SocialLink>
              <SocialLink href="#" aria-label="Discord"><ChatIcon size={20} /></SocialLink>
              <SocialLink href="#" aria-label="LinkedIn">in</SocialLink>
            </SocialLinks>
          </FooterColumn>
          <FooterColumn>
            <FooterTitle>Product</FooterTitle>
            <FooterLink to="/tasks">Tasks</FooterLink>
            <FooterLink to="/profile">Profile</FooterLink>
            <FooterLink to="/user-details">User Details</FooterLink>
            <FooterLink to="/signup">Sign Up</FooterLink>
          </FooterColumn>
          <FooterColumn>
            <FooterTitle>Features</FooterTitle>
            <FooterLink to="/web3-integration">Web3 Integration</FooterLink>
            <FooterLink to="/ai-powered">AI-Powered</FooterLink>
            <FooterLink to="/collaboration">Collaboration</FooterLink>
            <FooterLink to="/analytics">Analytics</FooterLink>
          </FooterColumn>
          <FooterColumn>
            <FooterTitle>Resources</FooterTitle>
            <FooterLink to="/documentation">Documentation</FooterLink>
            <FooterLink to="/api-reference">API Reference</FooterLink>
            <FooterLink to="/support">Support</FooterLink>
            <FooterLink to="/blog">Blog</FooterLink>
          </FooterColumn>
        </FooterGrid>
        <FooterBottom>
          <Copyright>
            © {new Date().getFullYear()} RewardFlow. All rights reserved.
          </Copyright>
          <FooterLinks>
            <FooterBottomLink to="/privacy-policy">Privacy Policy</FooterBottomLink>
            <FooterBottomLink to="/terms-of-service">Terms of Service</FooterBottomLink>
            <FooterBottomLink to="/cookie-policy">Cookie Policy</FooterBottomLink>
          </FooterLinks>
        </FooterBottom>
      </FooterContent>
    </Footer>
  );
};


