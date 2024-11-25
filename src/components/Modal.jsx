export default function Modal(props) {
	return props.isOpen ? (
		<div
			className="fixed z-20 flex items-center justify-center
      h-screen w-screen px-6 modal-bg"
		>
			<div className="modal rounded-lg max-w-96 bg-white-100 p-5">
				<div className="container max-w-max flex flex-col gap-4">
					<h1 className="text-left font-bold text-2xl text-blue-600">
						{props.headerMsg}
					</h1>
					<main>
						<p className="text-blue-500">{props.mainMsg}</p>
					</main>
					<footer className="w-full">
						<div className="container w-full gap-2 flex justify-between">
							<button
							  onClick={() => props.handleResponse(false)}
								className="bg-blue-500 text-white-100
                rounded-lg px-5 py-3 font-semibold w-full"
							>
								NO, CANCEL
							</button>
							<button
							  onClick={() => props.handleResponse(true)}
								className="bg-red-100 text-white-100
                rounded-lg px-5 py-3 font-semibold w-full"
							>
								YES, CONTINUE
							</button>
						</div>
					</footer>
				</div>
			</div>
		</div>
	) : <></>
}
