import { Campaign, ResolvedRecipient, FailedRecipient } from './types';

type CampaignUpdateCallback = (campaignId: string, updatedCampaign: Campaign, newFailures: FailedRecipient[]) => void;

class MockCommunicationEngine {
  private static instance: MockCommunicationEngine;
  private processingIntervals: Map<string, NodeJS.Timeout> = new Map();
  private subscribers: Set<CampaignUpdateCallback> = new Set();
  
  private constructor() {}

  public static getInstance(): MockCommunicationEngine {
    if (!MockCommunicationEngine.instance) {
      MockCommunicationEngine.instance = new MockCommunicationEngine();
    }
    return MockCommunicationEngine.instance;
  }

  public subscribe(callback: CampaignUpdateCallback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private notifySubscribers(campaignId: string, updatedCampaign: Campaign, newFailures: FailedRecipient[]) {
    this.subscribers.forEach(callback => callback(campaignId, updatedCampaign, newFailures));
  }

  public startCampaign(campaign: Campaign, recipients: ResolvedRecipient[]) {
    if (this.processingIntervals.has(campaign.id)) return;

    let currentCampaign: Campaign = { ...campaign, status: 'sending' };
    let currentFailures: FailedRecipient[] = [];

    // Initialize stats
    currentCampaign.stats = {
      ...currentCampaign.stats,
      queued: recipients.length,
      sending: 0,
      sent: 0,
      delivered: 0,
      read: 0,
      failed: 0,
    };
    
    let queuedRecipients = [...recipients];
    let sendingRecipients: ResolvedRecipient[] = [];
    let sentRecipients: ResolvedRecipient[] = [];
    let deliveredRecipients: ResolvedRecipient[] = [];
    
    this.notifySubscribers(campaign.id, currentCampaign, currentFailures);

    const interval = setInterval(() => {
      let madeProgress = false;
      
      // 1. Move some Delivered to Read (65-90% of delivered)
      const readCandidates = deliveredRecipients.filter(() => Math.random() < 0.3); // Process a bit each tick
      if (readCandidates.length > 0) {
        currentCampaign.stats.read += readCandidates.length;
        deliveredRecipients = deliveredRecipients.filter(r => !readCandidates.includes(r));
        madeProgress = true;
      }

      // 2. Move some Sent to Delivered (90-98% of sent)
      const deliverCandidates = sentRecipients.filter(() => Math.random() < 0.4);
      if (deliverCandidates.length > 0) {
        currentCampaign.stats.delivered += deliverCandidates.length;
        deliveredRecipients.push(...deliverCandidates);
        sentRecipients = sentRecipients.filter(r => !deliverCandidates.includes(r));
        madeProgress = true;
      }

      // 3. Move some Sending to Sent or Failed (96-100% success rate)
      if (sendingRecipients.length > 0) {
        const processCandidates = sendingRecipients.splice(0, Math.floor(Math.random() * 5) + 5); // process 5-10 at a time
        
        processCandidates.forEach(r => {
          currentCampaign.stats.sending--;
          if (Math.random() < 0.05) { // 5% failure rate
            currentCampaign.stats.failed++;
            const failureReasons = ['رقم غير صالح', 'تعذر التسليم', 'انتهت مهلة الإرسال', 'خطأ مؤقت'];
            currentFailures.push({
              guestId: r.id,
              name: r.name,
              phone: r.phone,
              reason: failureReasons[Math.floor(Math.random() * failureReasons.length)],
              failedAt: new Date().toISOString(),
              canRetry: true
            });
          } else {
            currentCampaign.stats.sent++;
            sentRecipients.push(r);
          }
        });
        madeProgress = true;
      }

      // 4. Move some Queued to Sending (batch of 10-25)
      if (queuedRecipients.length > 0 && sendingRecipients.length < 50) {
        const batchSize = Math.floor(Math.random() * 16) + 10;
        const toSend = queuedRecipients.splice(0, batchSize);
        currentCampaign.stats.queued -= toSend.length;
        currentCampaign.stats.sending += toSend.length;
        sendingRecipients.push(...toSend);
        madeProgress = true;
      }

      // 5. Check if finished
      const isFinished = currentCampaign.stats.queued === 0 && currentCampaign.stats.sending === 0;
      if (isFinished) {
        if (sentRecipients.length === 0 && deliveredRecipients.length === 0) {
           clearInterval(interval);
           this.processingIntervals.delete(campaign.id);
           
           if (currentCampaign.stats.failed === currentCampaign.stats.total) {
             currentCampaign.status = 'failed';
           } else if (currentCampaign.stats.failed > 0) {
             currentCampaign.status = 'partially_failed';
           } else {
             currentCampaign.status = 'completed';
           }
           madeProgress = true;
        }
      }

      if (madeProgress) {
        currentCampaign.failedRecipients = currentFailures;
        this.notifySubscribers(campaign.id, { ...currentCampaign }, currentFailures);
      }

    }, 800); // Check every 800ms

    this.processingIntervals.set(campaign.id, interval);
  }

  public stopCampaign(campaignId: string) {
    const interval = this.processingIntervals.get(campaignId);
    if (interval) {
      clearInterval(interval);
      this.processingIntervals.delete(campaignId);
    }
  }
}

export const mockEngine = MockCommunicationEngine.getInstance();
