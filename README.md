<p align="center">
  <img src="https://github.com/user-attachments/assets/40b79fc1-505e-42ea-9b4c-ec162ebecc0b">
</p>

<h3 align="center">For IP, By the IP, With IP</h3>

<p align="center">
  <a href="https://auditsseus-frontend.vercel.app/" style="color: #a77dff">Demo</a> | <a href="https://www.figma.com/deck/cw1wi1kce6xglRPErdpTBI" style="color: #a77dff">Pitchdeck</a> | <a href="https://youtu.be/85NKgbBRSr0" style="color: #a77dff">Demo Video</a>
</p>

<p align="center">
  <a href="https://github.com/hackathemy/eliza-buidl/tree/main/packages/plugin-story" style="color: #a77dff">ElizaOS Story protocol</a> | <a href="https://github.com/hackathemy/eliza-buidl/tree/main/packages/plugin-upstage" style="color: #a77dff">ElizaOS Upstage</a>
</p>

## Overview  
Auditsseus is an AI audit assistant service that automatically analyzes AI-generated creative content—such as images, videos, papers, and music—and compares it with existing IPs to detect potential plagiarism.

Based on Eliza and the Story Protocol Plugin, Auditsseus vectorizes uploaded content in real time and performs similarity comparisons with existing IP collections. 

It then provides a detailed report including plagiarism rates and similar references.

Furthermore, based on the analysis, Auditsseus assists in automatically registering the content as on-chain IP using Story Protocol, with a strong focus on protecting users’ creative works within the Web3 ecosystem.

![image](https://github.com/user-attachments/assets/26c11321-3605-413a-a4a1-f0bc9a673a9d)

## Problem: “Who’s protect my IP?”
1. It is difficult to detect plagiarism issues in AI-generated content, especially style plagiarism
2. Many similar IP issues also occurred in early protocol-related white papers, theses, etc.
3. IP registration and verification can be verified through manual direct search, making it difficult to protect in advance

## Solution: “We are protect your IP”  

**IP Audit and Plagiarism Detection**
- Vectorizes uploaded content and compares it in real-time with existing IPs  
- Calculates semantic similarity using **Eliza + Story Plugin**  
- Supports various formats including images and academic papers  

**AI-Based 'Style Plagiarism' Detection**
- Trained AI detects stylistic similarities such as painting style, color palette, and structural patterns  
- Continuously improves the model using user feedback and real uploaded data  

**Automated On-Chain Registration**
- Based on the plagiarism report, users can opt to automatically register the content as NFT IP via **Story Protocol**

## How to use Sponsor
- **[Story Protocol:](https://github.com/hackathemy/eliza-buidl/tree/main/packages/plugin-story)**
We automate the process of registering IPs using the Story Protocol and add an action that provides an audit before registering IP assets. When an audit is received, the uploaded image is compared with the IP assets searched and learned in the Story Protocol to measure the plagiarism rate and inform the user of the results. Users can later register assets with IPs and register audit results with IPs as well.

- **[Upstage:](https://github.com/hackathemy/eliza-buidl/tree/main/packages/plugin-upstage)**
I created an Eliza plugin using the Upstage API. Using the document parsing function and information extraction, the agent learns and provides content descriptions to the user based on that. It also provides audits when registering document IPs by determining the similarity with other documents.

- **PIN AI:**
Auditsseus is a personalized AI agent that analyzes user-generated content—such as images, papers, and videos—for potential plagiarism by comparing it to existing IPs. 
It then enables seamless on-chain IP registration via Story Protocol. 
Users interact naturally with the agent (e.g., “Check for plagiarism” or “Register as IP”), and the service automatically processes the request. 
Fully open-sourced and team-built, Auditsseus aligns perfectly with the PIN AI bounty by showcasing how personal data can drive useful, automated, and personalized AI workflows in real-world scenarios.

## Business Model  
**IP Registration Fee**
- A service fee is automatically charged when users choose to register their content as an IP on-chain via Story Protocol.

**Reward System**
- Users who contribute to content auditing by reporting or verifying potential plagiarism receive token-based rewards.
