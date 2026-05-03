import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
    CheckCircle2, 
    Shield, 
    Zap, 
    TrendingUp, 
    Users, 
    CreditCard,
    Star,
    ArrowRight
} from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();

    const advantages = [
        {
            icon: <Shield className="w-12 h-12 text-blue-600" />,
            title: "Direct Payment Control",
            description: "Pay your employees directly without relying on third-party payment processors. Full control over your payroll with enhanced security and transparency."
        },
        {
            icon: <Zap className="w-12 h-12 text-purple-600" />,
            title: "No Subscription Fees",
            description: "Zero monthly subscriptions or hidden charges. Pay only for what you use with our transparent pricing model. Save thousands annually on payroll processing."
        },
        {
            icon: <TrendingUp className="w-12 h-12 text-green-600" />,
            title: "Automated & Efficient",
            description: "Streamline your payroll process with automated invoicing, payment tracking, and comprehensive transaction history. Save time and reduce errors."
        }
    ];

    const reviews = [
        {
            name: "Sarah Johnson",
            company: "TechStart Inc.",
            role: "CEO",
            rating: 5,
            review: "This platform has revolutionized our payroll process. No more dealing with expensive third-party processors. We've saved over $15,000 in the first year alone!"
        },
        {
            name: "Michael Chen",
            company: "Digital Solutions Ltd.",
            role: "CFO",
            rating: 5,
            review: "The direct payment feature gives us complete control and transparency. Our employees love getting paid faster, and we love the cost savings."
        },
        {
            name: "Emily Rodriguez",
            company: "Creative Agency Co.",
            role: "HR Manager",
            rating: 5,
            review: "Setup was incredibly easy, and the automated invoicing saves us hours every month. The best payroll solution we've ever used!"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section */}
            <section className="container mx-auto px-4 py-20 md:py-32">
                <div className="max-w-4xl mx-auto text-center">
                    <Badge className="mb-4 px-4 py-2 text-sm" variant="secondary">
                        <Zap className="w-4 h-4 mr-2 inline" />
                        No Third-Party Fees • Direct Payments
                    </Badge>
                    
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                        Pay Your Employees
                        <span className="block text-blue-600 mt-2">Without the Middleman</span>
                    </h1>
                    
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                        A revolutionary payroll platform that eliminates third-party payment processors and subscription fees. 
                        Register your company, manage employees, and process payments directly—all in one place.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button 
                            size="lg" 
                            className="text-lg px-8 py-6 border hover:cursor-pointer hover:shadow-lg"
                            onClick={() => navigate('/auth/signup')}
                        >
                            Get Started Free
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                        <Button 
                            size="lg" 
                            variant="outline" 
                            className="text-lg px-8 py-6 hover:cursor-pointer"
                            onClick={() => navigate('/auth/login')}
                        >
                            Sign In
                        </Button>
                    </div>

                    <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            <span>No Setup Fees</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            <span>No Monthly Subscriptions</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            <span>Direct Bank Transfers</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="container mx-auto px-4 py-16 bg-blue-50 rounded-3xl my-16">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                        How It Works
                    </h2>
                    <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                        Get started in minutes with our simple three-step process
                    </p>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                1
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Register Your Company</h3>
                            <p className="text-gray-600">
                                Create your account and add your company details. Quick and secure setup in under 5 minutes.
                            </p>
                        </div>
                        
                        <div className="text-center">
                            <div className="bg-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                2
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Add Employees</h3>
                            <p className="text-gray-600">
                                Import or manually add your employees with their payment details. Manage everything from one dashboard.
                            </p>
                        </div>
                        
                        <div className="text-center">
                            <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                3
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Process Payments</h3>
                            <p className="text-gray-600">
                                Pay your employees directly with automated invoicing and instant transaction tracking.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Advantages Section */}
            <section className="container mx-auto px-4 py-16">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                        Why Choose Our Platform?
                    </h2>
                    <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                        Experience the future of payroll management with features designed for modern businesses
                    </p>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        {advantages.map((advantage, index) => (
                            <Card key={index} className="border-2 hover:shadow-xl transition-shadow duration-300">
                                <CardContent className="p-8">
                                    <div className="mb-4">
                                        {advantage.icon}
                                    </div>
                                    <h3 className="text-2xl font-semibold mb-3">
                                        {advantage.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {advantage.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Additional Features */}
            <section className="container mx-auto px-4 py-16 bg-gray-50 rounded-3xl my-16">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                        Everything You Need
                    </h2>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="flex items-start gap-4 bg-white p-6 rounded-lg">
                            <Users className="w-8 h-8 text-blue-600 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold mb-2">Employee Management</h4>
                                <p className="text-sm text-gray-600">Easily manage all employee information and payment details</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-4 bg-white p-6 rounded-lg">
                            <CreditCard className="w-8 h-8 text-blue-600 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold mb-2">Multiple Payment Methods</h4>
                                <p className="text-sm text-gray-600">Support for various payment methods and currencies</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-4 bg-white p-6 rounded-lg">
                            <CheckCircle2 className="w-8 h-8 text-blue-600 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold mb-2">Automated Invoicing</h4>
                                <p className="text-sm text-gray-600">Generate and send invoices automatically</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-4 bg-white p-6 rounded-lg">
                            <Shield className="w-8 h-8 text-blue-600 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold mb-2">Bank-Level Security</h4>
                                <p className="text-sm text-gray-600">Enterprise-grade encryption and security protocols</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-4 bg-white p-6 rounded-lg">
                            <TrendingUp className="w-8 h-8 text-blue-600 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold mb-2">Transaction History</h4>
                                <p className="text-sm text-gray-600">Complete audit trail of all payments and transactions</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-4 bg-white p-6 rounded-lg">
                            <Zap className="w-8 h-8 text-blue-600 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold mb-2">Instant Processing</h4>
                                <p className="text-sm text-gray-600">Fast payment processing with real-time updates</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reviews Section */}
            <section className="container mx-auto px-4 py-16">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                        Trusted by Companies Worldwide
                    </h2>
                    <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                        See what our customers have to say about their experience
                    </p>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        {reviews.map((review, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                                <CardContent className="p-6">
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(review.rating)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    
                                    <p className="text-gray-700 mb-6 italic leading-relaxed">
                                        "{review.review}"
                                    </p>
                                    
                                    <div className="border-t pt-4">
                                        <p className="font-semibold text-gray-900">{review.name}</p>
                                        <p className="text-sm text-gray-600">{review.role}</p>
                                        <p className="text-sm text-blue-600 font-medium">{review.company}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4 py-20">
                <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to Transform Your Payroll?
                    </h2>
                    <p className="text-xl mb-8 opacity-90">
                        Join thousands of companies saving time and money with direct employee payments
                    </p>
                    <Button 
                        size="lg" 
                        variant="secondary"
                        className="text-lg px-8 py-6 border border-2 hover:shadow-lg hover:cursor-pointer"
                        onClick={() => navigate('/auth/signup')}
                    >
                        Start Free Today
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                    <p className="mt-4 text-sm opacity-75">
                        No credit card required • Setup in minutes • Cancel anytime
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Home;

// Made with Bob
