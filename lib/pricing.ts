export type PricingCategory = 'general' | 'personal' | 'zumba';

export interface PricingPlan {
  id: string;
  name: string;
  duration: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
  category: PricingCategory;
}

export const pricingPlans: PricingPlan[] = [
  {
    id: '1-month',
    name: 'Monthly',
    duration: '1 Month',
    price: 2500,
    description: 'Perfect for starting your transformation journey',
    features: [
      'Full gym access',
      'All group classes including Zumba',
      'Locker room access',
      'Basic equipment training',
      'Mobile app access',
    ],
    category: 'general',
  },
  {
    id: '3-months',
    name: 'Quarterly',
    duration: '3 Months',
    price: 6000,
    description: 'Save Rs 1500 with quarterly commitment',
    features: [
      'Everything in Monthly',
      'Priority class booking',
      'Nutrition guide',
      'Progress tracking',
      'Email support',
    ],
    popular: true,
    category: 'general',
  },
  {
    id: '6-months',
    name: 'Semi-Annual',
    duration: '6 Months',
    price: 9000,
    description: 'Save Rs 6000 with half-year commitment',
    features: [
      'Everything in Quarterly',
      'Personal workout plan',
      'Monthly assessment',
      'Discount on workshops',
      'Priority support',
    ],
    category: 'general',
  },
  {
    id: '12-months',
    name: 'Annual',
    duration: '12 Months',
    price: 13000,
    description: 'Save Rs 17000 with annual commitment',
    features: [
      'Everything in Semi-Annual',
      'Unlimited personal training',
      'Exclusive workshops',
      'Guest passes (3/month)',
      'VIP locker access',
    ],
    popular: true,
    category: 'general',
  },
  {
    id: 'personal-training',
    name: 'Personal Training',
    duration: '12 Classes',
    price: 4500,
    description: 'One-on-one sessions with certified trainers',
    features: [
      'Personalized workout plans',
      'Form correction & technique',
      'Nutrition counseling',
      'Flexible scheduling',
      'Progress monitoring',
    ],
    category: 'personal',
  },
  {
    id: 'zumba-weekly',
    name: 'Zumba Weekly',
    duration: 'Weekly (2 Classes)',
    price: 2500,
    description: 'Weekly Zumba sessions to keep you moving',
    features: [
      '2 Zumba classes per week',
      'Expert instructors',
      'Latest music & choreography',
      'Fun group atmosphere',
      'Beginner-friendly',
      'No gym access required',
    ],
    popular: true,
    category: 'zumba',
  },
];

export function getPlanById(planId: string): PricingPlan | undefined {
  return pricingPlans.find((plan) => plan.id === planId);
}

export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}
