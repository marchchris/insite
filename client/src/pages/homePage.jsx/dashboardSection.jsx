import DashboardImage from "./images/dashboardOverviewPic.PNG";
import FormImage from "./images/formImage.PNG";

import CodeBlock from "../../components/codeBlock";
import FadeInOnScroll from "../../components/FadeIn";

const code = `<a 
    href="${window.location.origin}/form/{apiKey}"
    target="_blank"
    style="
        display: inline-block;
        padding: 8px 16px;
        background-color: #9333ea;
        color: white;
        border-radius: 50px;
        text-decoration: none;"
>
    Try Me
</a>`

export default function DashboardSection() {
    return (
        <div className="w-full 2xl:px-32 px-4 2xl:mt-0 mt-40">
            {/* Dashboard Section */}
            <FadeInOnScroll>
                <div className="w-full flex flex-row items-center justify-center">
                    {/* Content Image */}
                    <div className="flex-1 flex justify-end p-16">
                        <img src={DashboardImage} alt="Dashboard Overview" className="w-full rounded-xl border border-white border-opacity-20" />
                    </div>
                    {/* Content Text */}
                    <div className="flex-1">
                        <FadeInOnScroll>
                            <h1 className="2xl:text-4xl text-3xl font-medium mb-2"><span className="text-purple-300">Insightful</span> Dashboard</h1>
                            <h2 className="2xl:text-xl text-lg opacity-70">Monitor and manage feedback with a powerful, data-driven interface. The dashboard gives you a clear view of user sentiment and trends, helping you make informed decisions.</h2>
                        </FadeInOnScroll>
                        <div className="w-5/6">
                            <FadeInOnScroll>
                                <p className="2xl:2xl:text-lg text-base text-base mt-8 font-medium"> Real-Time Metrics. <span className="opacity-70 font-normal">Stay updated with key statistics like total feedback received, positive vs. negative sentiment, and resolved feedback—all at a glance.</span></p>
                            </FadeInOnScroll>
                            <FadeInOnScroll>
                                <p className="2xl:2xl:text-lg text-base text-base mt-4 font-medium"> Visual Analytics. <span className="opacity-70 font-normal">Gain deeper insights with interactive charts. Track feedback trends over time, identify recurring issues, and spot opportunities for improvement.</span></p>
                            </FadeInOnScroll>
                        </div>
                    </div>
                </div>
            </FadeInOnScroll>

            {/* Form Section */}
            <FadeInOnScroll>
                <div className="w-full flex flex-row items-center justify-center p-10 px-24 mt-20">
                    {/* Content Text */}
                    <div className="flex-1">
                        <FadeInOnScroll>
                            <h1 className="2xl:text-4xl text-3xl  font-medium mb-2"><span className="text-purple-300">Customizable</span> Form</h1>
                            <h2 className="2xl:text-xl text-lg opacity-70">Create a feedback form that fits your brand. Customize the title, description and appearance to match your website’s style.</h2>
                        </FadeInOnScroll>
                        <div className="w-5/6">
                            <FadeInOnScroll>
                                <p className="2xl:text-lg text-base mt-8 font-medium"> Personalized Setup. <span className="opacity-70 font-normal">Easily edit the form’s headings and description to guide users on providing valuable feedback.</span></p>
                            </FadeInOnScroll>
                            <FadeInOnScroll>
                                <p className="2xl:text-lg text-base mt-4 font-medium"> Light & Dark Mode. <span className="opacity-70 font-normal">Choose between a sleek dark theme or a clean light mode for seamless integration with your website’s design.</span></p>
                            </FadeInOnScroll>
                            <FadeInOnScroll>
                                <p className="2xl:text-lg text-base mt-4 font-medium"> Effortless User Engagement. <span className="opacity-70 font-normal">Make it easy for users to share their thoughts with an intuitive, responsive form that works across all devices.</span></p>
                            </FadeInOnScroll>
                        </div>
                    </div>
                    {/* Content Image */}
                    <div className="flex-1 flex justify-end">
                        <img src={FormImage} alt="Dashboard Overview" className="w-5/6 rounded-xl border border-white border-opacity-20" />
                    </div>
                </div>
            </FadeInOnScroll>


            {/* Integration Section */}
            <FadeInOnScroll>
                <div className="w-full flex flex-row items-center justify-center gap-8 p-10 mt-20">
                    {/* Content */}
                    <div className="flex-1 flex justify-center p-16 relative">

                        {/* Code Block */}
                        <div className="border border-white border-opacity-20 rounded-xl">
                            <CodeBlock language='html' code={code} />
                        </div>
                        <div className="absolute -bottom-4 2xl:right-24 right-4 bg-[#121212] rounded-xl border border-white border-opacity-15">
                            <div className="flex items-center gap-2 p-3">
                                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                            </div>
                            <div className="px-16 py-12">
                                <button className="bg-purple-400 rounded-full px-4 py-1 mb-4 hover:bg-purple-500 transition duration-300" onClick={() => {window.open(`${window.location.origin}/form/yww03DHsgbftIxdm`)}}>Try Me</button>
                            </div>
                        </div>
                    </div>
                    {/* Content Text */}
                    <div className="flex-1">
                        <FadeInOnScroll>
                            <h1 className="2xl:text-4xl text-3xl  font-medium mb-2"><span className="text-purple-300">Easy</span> Integration</h1>
                            <h2 className="2xl:text-xl text-lg opacity-70">Built for website owners and developers, InSite makes collecting, organizing, and acting on feedback effortless, all with just a single link.</h2>
                        </FadeInOnScroll>
                        <div className="w-5/6">
                            <FadeInOnScroll>
                                <p className="2xl:text-lg text-base mt-8 font-medium"> Straight Forward. <span className="opacity-70 font-normal">Add a feedback button to your website with a single line of code. No complex setup required.</span></p>
                            </FadeInOnScroll>
                            <FadeInOnScroll>
                                <p className="2xl:text-lg text-base mt-4 font-medium"> Dynamic Feedback Links. <span className="opacity-70 font-normal">Each website gets a unique link where users can leave feedback, tailored to your brand.</span></p>
                            </FadeInOnScroll>
                            <FadeInOnScroll>
                                <p className="2xl:text-lg text-base mt-4 font-medium"> Centralized Dashboard. <span className="opacity-70 font-normal">Access all your feedback in one place. Filter, sort and prioritize comments with ease.</span></p>
                            </FadeInOnScroll>
                        </div>
                    </div>
                </div>
            </FadeInOnScroll>
        </div>
    )
}
